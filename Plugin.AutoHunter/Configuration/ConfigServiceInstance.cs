using System;
using System.IO;
using HunterPie.Logger;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Plugin.AutoHunter.Configuration
{
    public class ConfigServiceInstance : IConfigService
    {
        public static string PluginDir = Path.GetDirectoryName(typeof(ConfigService).Assembly.Location);

        public event EventHandler<EventArgs> OnConfigChanged;
        
        public Config Current { get; set; }
        
        public void Save()
        {
            var settingsPath = Path.Combine(PluginDir, "config.json");
            File.WriteAllText(settingsPath, JsonConvert.SerializeObject(this.Current, new JsonSerializerSettings
            {
                Formatting = Formatting.Indented,
                Converters = new JsonConverter[] {new StringEnumConverter()}
            }));
            this.OnConfigChanged?.Invoke(this, EventArgs.Empty);
        }

        public void Load()
        {
            var settingsPath = Path.Combine(Path.GetDirectoryName(typeof(ConfigService).Assembly.Location), "config.json");
            try
            {
                if (File.Exists(settingsPath))
                {
                    var text = File.ReadAllText(settingsPath);
                    this.Current = JsonConvert.DeserializeObject<Config>(text);
                }
                else
                {
                    this.Current = new Config();
                }

                Save();
            }
            catch (Exception ex)
            {
                this.Current = new Config();
                Debugger.Error($"Error on loading config. Using default one. {ex}");
                // don't write default config to not override user changes in json and don't crash app if saving is failing
            }
        }
    }
}