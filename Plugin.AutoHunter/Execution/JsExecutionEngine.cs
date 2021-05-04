using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Engine.Js;
using Engine.Js.AddIns;
using HunterPie.Core;
using HunterPie.Memory;
using Plugin.AutoHunter.Configuration;
using Plugin.AutoHunter.Utils;

namespace Plugin.AutoHunter.Execution
{
    public class JsExecutionEngine : IDelayModContainer
    {
        private readonly Dictionary<string, object> hostObjects;
        
        public event EventHandler<EventArgs> ScriptReloaded
        {
            add { this.engine.OnFileReloaded += value; }
            remove { this.engine.OnFileReloaded -= value;  }
        }
        
        public event EventHandler<EventArgs> OnBeginReload
        {
            add { this.engine.OnBeginReload += value; }
            remove { this.engine.OnBeginReload -= value;  }
        }
        
        public event EventHandler<ExecutionErrorEventArgs> OnError
        {
            add { this.engine.OnExecutionError += value; }
            remove { this.engine.OnExecutionError -= value;  }
        }
        
        public event EventHandler<EventArgs> OnLogsClear
        {
            add { this.engine.OnLogsClear += value; }
            remove { this.engine.OnLogsClear -= value;  }
        }
        
        public event EventHandler<EventArgs> OnScriptHanged
        {
            add { this.engine.OnScriptHanged += value; }
            remove { this.engine.OnScriptHanged -= value;  }
        }
        
        public event Action<string> MessageReceived;

        private ClearScriptExecutionEngine engine;

        private readonly EventRegistrar eventRegistrar;
        private readonly HotkeysProvider hotkeysProvider;

        public JsExecutionEngine(Game game, Dictionary<string, object> hostObjects)
        {
            this.hostObjects = hostObjects;
            this.eventRegistrar = new EventRegistrar(game);
            this.hotkeysProvider = new HotkeysProvider();
            this.hotkeysProvider.OnLog += ForwardLog;

            CreateEngine();
        }

        private void ForwardLog(string obj) => this.MessageReceived?.Invoke(obj);

        private void CreateEngine()
        {
            try
            {
                var home = GetScriptHome();
                Logger.Log($"Using '{home}' as script home. Entry script is '{Path.GetFileName(ConfigService.Current.EntryScript)}'.");

                var localStoragePath = Path.Combine(ConfigServiceInstance.PluginDir, "storage", "localStorage.json");
                this.engine = new ClearScriptExecutionEngine(home).SetAddIns(a => a
                    .AddHotkeys(this.hotkeysProvider)
                    .AddBinaryHelpers()
                    .AddEventHandling(this.eventRegistrar)
                    .AddLocalStorage(new SingleFileLocalStorageProvider(localStoragePath))
                    .AddDelays(this)
                );

                this.engine.OnLog += OnEngineLog;
                this.engine.AutoReloadEnabled = ConfigService.Current.AutoReloadOnChange;
                
                ConfigService.Instance.OnConfigChanged += OnConfigChanged;
            }
            catch (Exception ex)
            {
                Logger.Error("Error on init, app must be restarted: " + ex);
            }
        }

        private void OnConfigChanged(object sender, EventArgs e)
        {
            this.engine.AutoReloadEnabled = ConfigService.Current.AutoReloadOnChange;
        }

        private void OnEngineLog(object _, MessageReceivedEventArgs args)
        {
            this.MessageReceived?.Invoke(args.Text);
        }

        private static string GetScriptHome()
        {
            return Path.IsPathRooted(ConfigService.Current.EntryScript)
                ? Path.GetDirectoryName(ConfigService.Current.EntryScript)
                : Path.Combine(ConfigServiceInstance.PluginDir, Path.GetDirectoryName(ConfigService.Current.EntryScript));
        }

        public void Reload() => this.engine.Reload();

        public bool IsEnabled
        {
            get
            {
                return this.eventRegistrar.EnableRaisingEvents && this.hotkeysProvider.IsEnabled;
            }
            set
            {
                this.eventRegistrar.EnableRaisingEvents = this.hotkeysProvider.IsEnabled = value;
            }
        }


        public void Init()
        {
            this.engine.Init(ConfigService.Current.WaitForDebugger ? ExecutionDebugFlags.DebugAndWait : ExecutionDebugFlags.Debug);
            
            foreach (var kv in this.hostObjects) 
                this.engine.AddObject(kv.Key, kv.Value);
            
            this.engine.AddType(typeof(Address));
            this.engine.SetAssemblyBundle("libs", 
                GetType().Assembly,     // Plugin
                typeof(Player).Assembly // HunterPie.Core
            );
            
            Task.Run(() => this.engine.RunScript(Path.GetFileName(ConfigService.Current.EntryScript)));
        }


        public void Terminate()
        {
            this.engine.Clear();
        }

        public double Mult => ConfigService.Current.DelayMult;
        public int Offset => ConfigService.Current.DelayOffset;
    }
}