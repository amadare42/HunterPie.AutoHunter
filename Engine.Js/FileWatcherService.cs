using System;
using System.Collections.Generic;
using System.IO;

namespace Engine.Js
{
    public interface IFileWatcherService
    {
        event EventHandler OnFileChanged;
        void Add(string fullPath);
        void Clear();
    }

    public class FileWatcherService : IFileWatcherService
    {
        private HashSet<FileSystemWatcher> watchers = new();
        private HashSet<string> paths = new();
        public event EventHandler OnFileChanged;

        private readonly object locker = new();

        public FileWatcherService()
        {
            this.Enabled = true;
        }

        public bool Enabled { get; set; }

        public void Add(string fullPath)
        {
            lock (this.locker)
            {
                if (this.paths.Contains(fullPath))
                {
                    return;
                }

                this.paths.Add(fullPath);

                var fileName = Path.GetFileName(fullPath);
                var dir = Path.GetDirectoryName(fullPath);
                var watcher = new FileSystemWatcher(dir, fileName);

                var onChanged = new EventHandler<FileSystemEventArgs>((sender, fileSystemEventArgs) =>
                {
                    if (this.Enabled)
                    {
                        this.OnFileChanged?.Invoke(sender, fileSystemEventArgs);
                    }
                }).Debounce();

                watcher.Changed += (_, args) => onChanged(_, args);
                watcher.Deleted += (_, args) => onChanged(_, args);
                watcher.Renamed += (_, args) => onChanged(_, args);
                watcher.Created += (_, args) => onChanged(_, args);
                
                watcher.EnableRaisingEvents = true;

                this.watchers.Add(watcher);
            }
        }

        public void Clear()
        {
            lock (this.locker)
            {
                foreach (var watcher in this.watchers)
                {
                    watcher.EnableRaisingEvents = false;
                    watcher.Dispose();
                }

                this.watchers.Clear();
                this.paths.Clear();
            }
        }
    }
}