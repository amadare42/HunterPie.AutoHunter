using System;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Engine.Js.AddIns
{
    public class LocalStorageAddIn : IAddIn
    {
        private readonly ILocalStorageProvider storageProvider;
        public string Name => "LocalStorage";
        public string RegisterStatement => ClearScriptExecutionEngine.ReadScriptFromResources("AddIns.localStorage.js");
        public object AddInObject => this.storageProvider;

        public LocalStorageAddIn(ILocalStorageProvider storageProvider)
        {
            this.storageProvider = storageProvider;
        }

        public void OnScriptUnload()
        {
        }
    }
    
    
    public interface ILocalStorageProvider
    {
        object GetItem(string key);

        void SetItem(string key, string json);

        void RemoveItem(string key);

        void Clear();
    }

    public class SingleFileLocalStorageProvider : ILocalStorageProvider
    {
        private readonly string filePath;

        private JObject storage = null;
        private DateTime? lastWriteTime = null;

        public SingleFileLocalStorageProvider(string filePath)
        {
            this.filePath = filePath;
        }

        public object GetItem(string key)
        {
            UpdateStorage();
            return this.storage[key]?.ToString() ?? "undefined";
        }

        public void SetItem(string key, string json)
        {
            UpdateStorage();
            this.storage[key] = JToken.Parse(json);
            WriteStorage();
        }

        public void RemoveItem(string key)
        {
            UpdateStorage();
            this.storage.Remove(key);
            WriteStorage();
        }

        public void Clear()
        {
            this.storage = JObject.Parse("{}");
            WriteStorage();
        }

        private void UpdateStorage()
        {
            // ensure file exists
            if (!File.Exists(this.filePath))
            {
                var dirPath = Path.GetDirectoryName(this.filePath);
                Directory.CreateDirectory(dirPath);
                File.WriteAllText(this.filePath, "{}");
            }

            var writeTime = File.GetLastWriteTime(this.filePath);
            if (writeTime != this.lastWriteTime)
            {
                this.storage = JObject.Parse(File.ReadAllText(this.filePath));
                this.lastWriteTime = writeTime;
            }
        }

        private void WriteStorage()
        {
            File.WriteAllText(this.filePath, this.storage.ToString());
            this.lastWriteTime = File.GetLastWriteTime(this.filePath);
        }
        
        
    }
}