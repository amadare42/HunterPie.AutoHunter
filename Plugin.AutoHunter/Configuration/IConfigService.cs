namespace Plugin.AutoHunter.Configuration
{
    public interface IConfigService
    {
        Config Current { get; }
        void Save();

        void Load();
    }
}