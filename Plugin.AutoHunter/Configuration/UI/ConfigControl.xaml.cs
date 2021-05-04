using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Runtime.CompilerServices;
using System.Windows.Controls;
using Engine.Js;
using HunterPie.Settings;
using HunterPie.UI.Annotations;

namespace Plugin.AutoHunter.Configuration.UI
{
    /// <summary>
    /// Interaction logic for ConfigControl.xaml
    /// </summary>
    public partial class ConfigControl : UserControl, INotifyPropertyChanged, ISettings
    {
        public ConfigControl()
        {
            InitializeComponent();
        }
        
        #region Configuration properties

        private bool enabledByDefault;
        public bool EnabledByDefault
        {
            get => this.enabledByDefault;
            set
            {
                if (this.enabledByDefault == value) return;
                this.enabledByDefault = value;
                OnPropertyChanged();
            }
        }

        private string toggleKey;
        public string ToggleKey
        {
            get => this.toggleKey;
            set
            {
                if (this.toggleKey == value) return;
                this.toggleKey = value;
                OnPropertyChanged();
            }
        }


        private string reloadKey;
        public string ReloadKey
        {
            get => this.reloadKey;
            set
            {
                if (this.reloadKey == value) return;
                this.reloadKey = value;
                OnPropertyChanged();
            }
        }

        private string entryScript;
        public string EntryScript
        {
            get => this.entryScript;
            set
            {
                if (this.entryScript == value) return;
                this.entryScript = value;
                OnPropertyChanged();
            }
        }

        private bool logIntoConsole;

        public bool LogIntoConsole
        {
            get => this.logIntoConsole;
            set
            {
                if (this.logIntoConsole == value) return;
                this.logIntoConsole = value;
                OnPropertyChanged();
            }
        }


        private bool groupLogMessages;

        public bool GroupLogMessages
        {
            get => this.groupLogMessages;
            set
            {
                if (this.groupLogMessages == value) return;
                this.groupLogMessages = value;
                OnPropertyChanged();
            }
        }


        private bool widgetAlwaysVisible;

        public bool WidgetAlwaysVisible
        {
            get => this.widgetAlwaysVisible;
            set
            {
                if (this.widgetAlwaysVisible == value) return;
                this.widgetAlwaysVisible = value;
                OnPropertyChanged();
            }
        }


        private bool autoReloadOnChange;

        public bool AutoReloadOnChange
        {
            get => this.autoReloadOnChange;
            set
            {
                if (this.autoReloadOnChange == value) return;
                this.autoReloadOnChange = value;
                OnPropertyChanged();
            }
        }


        private double delayMult;

        public double DelayMult
        {
            get => this.delayMult;
            set
            {
                if (this.delayMult == value) return;
                this.delayMult = value;
                OnPropertyChanged();
            }
        }


        private int delayOffset;

        public int DelayOffset
        {
            get => this.delayOffset;
            set
            {
                if (this.delayOffset == value) return;
                this.delayOffset = value;
                OnPropertyChanged();
            }
        }

        #endregion

        public event PropertyChangedEventHandler PropertyChanged;
        
        [NotifyPropertyChangedInvocator]
        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            IsSettingsChanged = true;
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
        
        public void LoadSettings()
        {
            ConfigService.Load();
            var config = ConfigService.Current;
            
            this.EnabledByDefault = config.EnabledByDefault;
            this.ToggleKey = config.ToggleKey;
            this.ReloadKey = config.ReloadKey;
            this.FileSelect.SelectedPath = this.EntryScript = GetScriptFullPath(config.EntryScript);
            this.LogIntoConsole = config.Logs.LogIntoConsole;
            this.GroupLogMessages = config.Logs.GroupLogMessages;
            this.WidgetAlwaysVisible = config.WidgetAlwaysVisible;
            this.AutoReloadOnChange = config.AutoReloadOnChange;
            this.DelayMult = config.DelayMult;
            this.DelayOffset = config.DelayOffset;
            
            IsSettingsChanged = false;
        }

        public void SaveSettings()
        {
            var config = ConfigService.Current;
            
            config.EnabledByDefault = this.EnabledByDefault;
            config.ToggleKey = this.ToggleKey;
            config.ReloadKey = this.ReloadKey;
            config.EntryScript = GetScriptRelativePath(this.EntryScript);
            config.Logs.LogIntoConsole = this.LogIntoConsole;
            config.Logs.GroupLogMessages = this.GroupLogMessages;
            config.WidgetAlwaysVisible = this.WidgetAlwaysVisible;
            config.AutoReloadOnChange = this.AutoReloadOnChange;
            config.DelayMult = Math.Round(this.DelayMult, 1);
            config.DelayOffset = this.DelayOffset;
            
            ConfigService.Save();
        }

        public string ValidateSettings()
        {
            if (string.IsNullOrEmpty(this.EntryScript))
            {
                return "Entry script must be specified!";
            }
            
            var fullScriptPath = GetScriptFullPath(this.EntryScript);
            return File.Exists(fullScriptPath)
                ? null
                : $"File {fullScriptPath} doesn't exist!";
        }

        public string GetScriptFullPath(string path)
        {
            return Path.IsPathRooted(path)
                ? path
                : Path.Combine(ConfigServiceInstance.PluginDir, path);
        }

        public string GetScriptRelativePath(string path)
        {
            if (Path.IsPathRooted(path) && !Path.GetFullPath(path).StartsWith(ConfigServiceInstance.PluginDir))
            {
                return path;
            }

            return PathEx.MakeRelativePath(ConfigServiceInstance.PluginDir + '\\', path);
        }

        public bool IsSettingsChanged { get; protected set; }
    }
}
