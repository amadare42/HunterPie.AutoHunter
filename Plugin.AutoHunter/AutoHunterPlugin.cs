using System;
using System.Collections.Generic;
using System.Media;
using System.Threading.Tasks;
using System.Windows;
using Engine.Js;
using HunterPie.Core;
using HunterPie.Core.Input;
using HunterPie.GUI;
using HunterPie.Memory;
using HunterPie.Plugins;
using HunterPie.Settings;
using Plugin.AutoHunter.CheatEngine;
using Plugin.AutoHunter.Configuration;
using Plugin.AutoHunter.Configuration.UI;
using System.Linq;
using System.Windows.Media.Imaging;
using Plugin.AutoHunter.Execution;
using Plugin.AutoHunter.Utils;
using Plugin.AutoHunter.Widget;

namespace Plugin.AutoHunter
{
    /*
     * TODO: fix deadlock on sync inputs
     * TODO: fix widget height not recalculating correctly after width change
     */
    public partial class AutoHunterPlugin : IPlugin, ISettingsOwner
    {
        private JsExecutionEngine executionEngine;
        private readonly CeTableParser ceTableParser;
        private readonly InteropMemoryService memoryReader;

        private Dictionary<string, object> hostObjects;
        private readonly LimitedSizeStack<LogEntryViewModel> logStack = new(3);

        public AutoHunterPlugin()
        {
            this.ceTableParser = new CeTableParser();
            this.memoryReader = new InteropMemoryService(this.ceTableParser);
        }

        public void Initialize(Game context)
        {
            this.Context = context;
            
            // config
            ConfigService.Load();

            if (ConfigService.Current.WaitOnPluginInitialization)
            {
                MessageBox.Show("Press OK after debugger attached");
            }
            
            Application.Current.Dispatcher.Invoke(() =>
            {
                this.grinderWidget = new AutoHunterWidget(ConfigService.Instance);
                Overlay.RegisterWidget(grinderWidget);
            });
            
            Kernel.OnGameStart += KernelOnOnGameStart;

            // events
            if (Kernel.GameIsRunning)
            {
                this.ceTableParser.LoadTable(Kernel.GameVersion);
            }
            
            // engine
            InitJsEngine(context);
            
            // enabled by default
            if (!ConfigService.Current.EnabledByDefault)
            {
                Toggle();
            }
            UpdateWidget();
            
            // hotkeys
            this.KeyCode = Hotkey.Register(ConfigService.Current.ToggleKey, Toggle);
            this.KeyCodeReload = Hotkey.Register(ConfigService.Current.ReloadKey, () =>
            {
                AddLog("reload requested");
                this.executionEngine.Reload();
            });
        }

        public void Unload()
        {
            Overlay.UnregisterWidget(this.grinderWidget);
            Application.Current.Dispatcher.Invoke(() => this.grinderWidget.Close());
            
            Kernel.OnGameStart -= KernelOnOnGameStart;

            Hotkey.Unregister(this.KeyCode);
            Hotkey.Unregister(this.KeyCodeReload);

            this.executionEngine.Terminate();
            this.executionEngine.MessageReceived -= OnLog;
            this.executionEngine.OnLogsClear -= OnLogsClear;
            this.executionEngine.OnBeginReload -= OnBeginReload;
            this.executionEngine.ScriptReloaded -= OnScriptReloaded;
            this.executionEngine.OnError -= OnError;
            this.executionEngine.OnScriptHanged -= OnScriptHanged;
        }

        private void KernelOnOnGameStart(object source, EventArgs args) => this.ceTableParser.LoadTable(Kernel.GameVersion);

        private void InitJsEngine(Game context)
        {
            this.executionEngine?.Terminate();
            
            this.hostObjects = CreateInteropFunctions();
            this.executionEngine = new JsExecutionEngine(context, this.hostObjects);
            this.executionEngine.OnBeginReload += OnBeginReload;
            this.executionEngine.OnLogsClear += OnLogsClear;
            this.executionEngine.ScriptReloaded += OnScriptReloaded;
            this.executionEngine.MessageReceived += OnLog;
            this.executionEngine.OnError += OnError;
            this.executionEngine.OnScriptHanged += OnScriptHanged;
            this.executionEngine.Init();
        }

        private void OnLogsClear(object sender, EventArgs e)
        {
            this.logStack.Clear();
            this.grinderWidget.ClearLogs();
        }

        private void OnBeginReload(object sender, EventArgs e)
        {
            this.logStack.Clear();
            this.grinderWidget.ClearStickyLogs();
            this.grinderWidget?.InvalidateCountdowns();
        }

        private void OnScriptHanged(object sender, EventArgs e)
        {
            AddLog("[script unresponsive, reload may be needed]");
        }

        private void OnLog(object log)
        {
            var msg = log?.ToString().Trim('\"').TrimEnd('\n');
            var vm = AddLog(msg);
            if (vm != null && (msg?.StartsWith("[DELAY]") ?? false))
            {
                var countdown = int.Parse(msg.Split()[1]);
                vm.Countdown = countdown;
            }
        }
        
        private void OnError(object log, ExecutionErrorEventArgs executionErrorEventArgs)
        {
            AddLog("ERROR: " + executionErrorEventArgs.JsError);
        }
        
        private void OnScriptReloaded(object sender, EventArgs args) {
            SystemSounds.Asterisk.Play();
            UpdateWidget($"Script reloaded @ {DateTime.Now:T}");
            this.grinderWidget.AddLog("-- script reloaded --");
        }

        private LogEntryViewModel AddLog(string log)
        {
            var now = DateTime.Now;
            
            if (ConfigService.Current.Logs.LogIntoConsole)
            {
                Logger.Log(log);
            }
            
            if (ConfigService.Current.Logs.GroupLogMessages)
            {
                // group repeating entries
                var existingLog = this.logStack.FirstOrDefault(l => l.Text == log && l.Countdown == 0 && !l.IsOutdated);
                if (existingLog != null)
                {
                    existingLog.Counter++;
                    existingLog.CreatedTime = now;
                    return existingLog;
                }
            }

            var newLog = this.grinderWidget.AddLog(log);
            this.logStack.Push(newLog);
            return newLog;
        }

        public int KeyCodeReload { get; set; }
        public int KeyCode { get; set; }

        public void Toggle()
        {
            this.executionEngine.IsEnabled = !this.executionEngine.IsEnabled;
            Logger.Log("AutoHunter is now " + (this.executionEngine.IsEnabled ? "Enabled" : "Disabled"));
            UpdateWidget();
        }

        private void UpdateWidget(string state = null)
        {
            Task.Run(() => Application.Current.Dispatcher.Invoke(() =>
            {
                if (this.grinderWidget == null) return;
                this.grinderWidget.WidgetState = new WidgetState
                {
                    Phase = state ?? "Idle",
                    IsEnabled = this.executionEngine.IsEnabled,
                    Hotkeys = $"(Toggle: {ConfigService.Current.ToggleKey}, Reload: {ConfigService.Current.ReloadKey})"
                };
            }));
        }

        private AutoHunterWidget grinderWidget;

        public string Name { get; set; }
        public string Description { get; set; }
        public Game Context { get; set; }
        
        public IEnumerable<ISettingsTab> GetSettings(ISettingsBuilder build) => build.AddTab(
            new ConfigControl(), 
            GetPluginImage()
        )
        .Value();

        private static BitmapImage GetPluginImage()
        {
            var assembly = typeof(AutoHunterPlugin).Assembly;
            var bitmap = new BitmapImage();

            using var stream = assembly.GetManifestResourceStream("Plugin.AutoHunter.Resources.icon_miniature.png");
            bitmap.BeginInit();
            bitmap.StreamSource = stream;
            bitmap.CacheOption = BitmapCacheOption.OnLoad;
            bitmap.EndInit();

            return bitmap; 
        }
    }
}