namespace Plugin.AutoHunter.Configuration
{
    public class Config
    {
        public bool EnabledByDefault = true;
        public string ToggleKey = "Alt+Shift+F11";
        public string ReloadKey = "Alt+Ctrl+F11";

        public WidgetPosition Widget { get; set; } = new();

        public bool WaitForDebugger { get; set; } = false;
        public string EntryScript { get; set; } = "scripts/main.js";

        public LogsConfig Logs { get; set; } = new();

        public bool WaitOnPluginInitialization { get; set; } = false;

        public bool WidgetAlwaysVisible { get; set; } = false;

        public bool AutoReloadOnChange { get; set; } = true;
        public double DelayMult { get; set; } = 1;

        public int DelayOffset { get; set; } = 0;
    }
}