using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.ClearScript;
using Microsoft.ClearScript.JavaScript;

namespace Engine.Js
{
    internal class MyDocumentLoader : DocumentLoader
    {
        public string BasePath { get; internal set; }
        private readonly FileWatcherService watcherService;
        internal Babel Babel { get; set; }

        private Dictionary<string, CachedEntry> Cache = new();

        public MyDocumentLoader(string basePath, FileWatcherService watcherService)
        {
            this.BasePath = basePath;
            this.watcherService = watcherService;
            this.Babel = new Babel();
        }

        public override Task<Document> LoadDocumentAsync(DocumentSettings settings, DocumentInfo? sourceInfo, string specifier, DocumentCategory category,
            DocumentContextCallback contextCallback)
        {
            var callerBasePath = sourceInfo == null 
                ? this.BasePath
                : Path.GetDirectoryName(PathEx.CombineAndNormalize(this.BasePath, sourceInfo.Value.Name));
            
            var fullPath = PathEx.CombineAndNormalize(callerBasePath, specifier);
            fullPath = PathResolvers.Select(f => f(fullPath))
                .FirstOrDefault(File.Exists);

            if (fullPath == null)
            {
                throw new Exception($"Cannot find file '{specifier}' in '{callerBasePath}'");
            }
            
            if (!fullPath.StartsWith(this.BasePath))
            {
                throw new Exception($"Cannot import file '{specifier}' from '{callerBasePath}': only sub-folders of root is supported.");
            }

            if (this.Cache.TryGetValue(fullPath, out var cachedEntry))
            {
                var lastWriteTime = File.GetLastWriteTime(fullPath);
                if (lastWriteTime.Equals(cachedEntry.LastWriteTime))
                {
                    this.watcherService.Add(fullPath);
                    return Task.FromResult(cachedEntry.Document);
                }
            }
            
            var relativePath = PathEx.MakeRelativePath(this.BasePath + '\\', fullPath);
            var fileContent = this.Babel.Transpile(relativePath, File.ReadAllText(fullPath));
            Document doc = new StringDocument(new DocumentInfo(fullPath)
            {
                Category = ModuleCategory.Standard
                // TODO: sourcemaps support
            }, fileContent);
            this.Cache[fullPath] = new CachedEntry(doc, File.GetLastWriteTime(fullPath));
            this.watcherService.Add(fullPath);
            return Task.FromResult(doc);
        }

        private static readonly Func<string, string>[] PathResolvers = {
            fullPath => fullPath,
            fullPath => Path.Combine(fullPath, "index.ts"),
            fullPath => Path.Combine(fullPath, "index.js"),
            fullPath => fullPath + ".ts",
            fullPath => fullPath + ".js"
        };

        class CachedEntry
        {
            public Document Document { get; set; }
            public DateTime LastWriteTime { get; set; }

            public CachedEntry(Document document, DateTime lastWriteTime)
            {
                this.Document = document;
                this.LastWriteTime = lastWriteTime;
            }

            public CachedEntry()
            {
            }
        }
    }
}