using System;
using System.Threading;
using System.Threading.Tasks;
using Engine.Js.AddIns;

namespace Engine.Js
{
    public class DelayTriggerEventArgs : EventArgs
    {
        public int Delay { get; set; }

        public DelayTriggerEventArgs(int delay)
        {
            this.Delay = delay;
        }
    }
    
    public class ScriptContext
    {
        private readonly NativeTimer timers;
        private IEventRegistrar EventRegistrar { get; }
        private bool isWaiting = false;
        
        public string BasePath { get; internal set; }

        public bool EnableRaisingEvents => this.EventRegistrar.EnableRaisingEvents;

        public object AddIns { get; internal set; } = new();
        
        public bool IsDebug { get; set; }


        public EventHandler<MessageReceivedEventArgs> OnLog;
        public event EventHandler<EventArgs> OnLogsClear;
        public event EventHandler<EventArgs> OnScriptHanged;

        internal event EventHandler<DelayTriggerEventArgs> OnDelayRequested; 

        public event EventHandler<EventArgs> OnReset; 

        public ScriptContext(string basePath)
        {
            this.BasePath = basePath;
            this.timers = new NativeTimer();
        }
        
        #region Output

        public void WriteLine(string text, bool isDebug) => this.OnLog?.Invoke(this, new MessageReceivedEventArgs(text, isDebug));

        public void Clear() => this.OnLogsClear?.Invoke(this, EventArgs.Empty);

        #endregion
        
        #region Timers

        public void Wait(int delay)
        {
            this.isWaiting = true;
            var are = new AutoResetEvent(false);
            SetTimeout(new Action(() => are.Set()), delay, true);
            are.WaitOne();
            this.isWaiting = false;
        }
        
        public int SetTimeout(dynamic cb, int delay, bool isDelay) => this.timers.SetTimeout(cb, delay);
        
        public int SetTimeout(dynamic cb, int delay) => this.timers.SetTimeout(cb, delay);

        public int SetInterval(dynamic cb, int interval) => this.timers.SetInterval(cb, interval);

        public void ClearTimer(int id) => this.timers.Clear(id);
        
        public void ClearAllTimers() => this.timers.ClearAll();
        
        #endregion

        public void SetKeepAliveCb(dynamic cb)
        {
            SetInterval(new Action(() =>
            {
                if (this.isWaiting) return;
                var task = Task.Run(() => cb());
                var timeout = Task.Delay(100);
                if (Task.WaitAny(task, timeout) == 1)
                {
                    this.OnScriptHanged?.Invoke(this, EventArgs.Empty);
                }
            }), 1000);
        }
        
        #region Internal

        internal void Reset()
        {
            ClearAllTimers();
            this.OnReset?.Invoke(this, EventArgs.Empty);
        }

        #endregion
    }
}