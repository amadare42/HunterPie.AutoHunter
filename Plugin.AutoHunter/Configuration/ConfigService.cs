namespace Plugin.AutoHunter.Configuration
{
    public static class ConfigService
    {
        public static readonly ConfigServiceInstance Instance = new();

        public static Config Current => Instance.Current;

        public static void Save() => Instance.Save();

        public static void Load() => Instance.Load();
    }
}