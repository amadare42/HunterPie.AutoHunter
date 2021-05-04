namespace Plugin.AutoHunter.Configuration
{
    public class LogsConfig
    {
        public int MaxEntries { get; set; } = 30;
        public int EntryTimeoutMs { get; set; } = 30000;
        public int UpdateTimeoutMs { get; set; } = 1500;

        public bool LogIntoConsole { get; set; } = false;
        
        public bool GroupLogMessages { get; set; } = true;
    }
}