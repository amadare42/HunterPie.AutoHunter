namespace Plugin.AutoHunter.Widget
{
    public class WidgetState
    {
        public bool IsEnabled { get; set; } = false;
        public string Phase { get; set; } = "";

        public string Hotkeys { get; set; } = "";

        public string IsEnabledText => this.IsEnabled ? "Enabled" : "Disabled";
    }
}