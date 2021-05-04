using System;
using System.Collections.Generic;
using System.Linq;

namespace Engine.Js
{
    public class NativeTimer
    {
        public static int TimerResolution = 5;
        
        public int SetTimeout(dynamic cb, int delay)
        {
            var timer = CreateTimer(false, delay);
            timer.Elapsed += (sender, _) =>
            {
                cb();
                Clear(sender.GetHashCode());
                timer.Dispose();
            };
            timer.Start();

            return timer.GetHashCode();
        }

        public void ClearAll()
        {
            var timers = this.Timers.Values.ToArray();
            this.Timers.Clear();
            foreach (var timer in timers)
            {
                timer.Dispose();
            }
        }

        public void Clear(int id)
        {
            if (this.Timers.TryGetValue(id, out var timer))
            {
                timer.Dispose();
                this.Timers.Remove(id);
            }
        }

        public int SetInterval(dynamic cb, int interval)
        {
            var timer = CreateTimer(true, interval);
            timer.Elapsed += (sender, _) =>
            {
                try
                {
                    cb();
                }
                catch{}
            };
            timer.Start();

            return timer.GetHashCode();
        }

        private Dictionary<int, MultimediaTimer> Timers = new();

        private MultimediaTimer CreateTimer(bool isPeriodic, int delay)
        {
            var timer = new MultimediaTimer(isPeriodic)
            {
                Interval = delay,
                Resolution = TimerResolution
            };
            this.Timers[timer.GetHashCode()] = timer;
            
            return timer;
        }
    }
}