using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Engine.Js.AddIns;
using Microsoft.ClearScript;
using Microsoft.ClearScript.JavaScript;
using Microsoft.ClearScript.V8;

namespace Engine.Js
{
    public class ExecutionErrorEventArgs : EventArgs
    {
        public string JsError => Exception is IScriptEngineException ex ? ex.ErrorDetails : null;

        public Exception Exception { get; set; }

        public ExecutionErrorEventArgs(Exception exception)
        {
            this.Exception = exception;
        }
    }
    
    public class ClearScriptExecutionEngine
    {
        private V8ScriptEngine engine;
        private readonly FileWatcherService fileWatcherService;
        private readonly MyDocumentLoader documentLoader;
        private readonly ScriptContext context;

        private RunSnapshot lastRun = new()
        {
            Flags = ExecutionDebugFlags.None,
            ScriptPath = null
        };
        
        private List<IAddIn> AddIns { get; set; } = new();

        private Dictionary<string, object> AddedObjects = new();
        private HashSet<Action<V8ScriptEngine>> AddTypes = new();
        private HashSet<Assembly> AddAssemblies = new();
        private string assemblyBundleName;

        public bool IsRunning => this.engine != null;

        public bool IsDebug
        {
            get => this.context.IsDebug;
            set { this.context.IsDebug = value;  }
        }

        public bool AutoReloadEnabled
        {
            get => this.fileWatcherService.Enabled;
            set => this.fileWatcherService.Enabled = value;
        }

        public event EventHandler<MessageReceivedEventArgs> OnLog
        {
            add => this.context.OnLog += value;
            remove => this.context.OnLog -= value;
        }
        
        public event EventHandler<EventArgs> OnLogsClear
        {
            add => this.context.OnLogsClear += value;
            remove => this.context.OnLogsClear -= value;
        }

        public event EventHandler<EventArgs> OnFileReloaded; 
        public event EventHandler<EventArgs> OnBeginReload; 
        public event EventHandler<EventArgs> OnScriptHanged;

        public event EventHandler<ExecutionErrorEventArgs> OnExecutionError; 

        public ClearScriptExecutionEngine(string basePath)
        {
            this.fileWatcherService = new FileWatcherService();
            this.fileWatcherService.OnFileChanged += OnFileChanged;
            this.context = new ScriptContext(basePath);
            this.context.OnScriptHanged += ContextOnOnScriptHanged;
            
            this.documentLoader = new MyDocumentLoader(this.context.BasePath, this.fileWatcherService);
        }

        public void SetBasePath(string basePath)
        {
            this.context.BasePath = basePath;
            this.documentLoader.BasePath = basePath;
        }

        public void Init(ExecutionDebugFlags flags = ExecutionDebugFlags.None)
        {
            this.lastRun.Flags = flags;
            CreateEngine(flags);
        }
        
        public void RunScript(string relativeScriptPath)
        {
            try
            {
                this.fileWatcherService.Clear();
                var fullPath = ResolveRelativeScriptPath(relativeScriptPath);

                var doc = this.engine.DocumentSettings.Loader.LoadDocument(this.engine.DocumentSettings, null,
                    relativeScriptPath, DocumentCategory.Script, null);

                this.lastRun.ScriptPath = relativeScriptPath;

                using var sr = new StreamReader(doc.Contents);
                var script = this.engine.Compile(doc.Info, sr.ReadToEnd());
                this.fileWatcherService.Add(fullPath);

                AddObjects();
                this.engine.Execute(script);
            }
            catch (Exception ex)
            {
                OnExecutionError?.Invoke(this, new ExecutionErrorEventArgs(ex));
            } 
        }
        
        
        public void Reset(bool watchEntry = false)
        {
            Clear(watchEntry);
        }

        private void CreateEngine(ExecutionDebugFlags flags)
        {
            this.engine = new V8ScriptEngine(MapFlags(flags))
            {
                DocumentSettings = { Loader = this.documentLoader, SearchPath = this.context.BasePath },
                AllowReflection = true,
                ExposeHostObjectStaticMembers = true,
            };
            this.engine.AddHostType(typeof(Task));
            this.engine.AddHostType(typeof(JavaScriptExtensions));
            
            this.engine.AddHostObject("host", new ExtendedHostFunctions());
            var typeCollection = new HostTypeCollection("mscorlib", "System", "System.Core");

            this.engine.AddHostObject("clr", typeCollection);
            
            dynamic consoleWrapCb = this.engine.Evaluate("engine.bootstrap.js [internal]", GetBootstrapScript());
            consoleWrapCb(this.context);
        }


        public void Reload()
        {
            this.OnBeginReload?.Invoke(this, EventArgs.Empty);
            Clear();
            if (string.IsNullOrEmpty(this.lastRun.ScriptPath))
                return;
            
            Init(this.lastRun.Flags);
            RunScript(this.lastRun.ScriptPath);
            this.OnFileReloaded?.Invoke(this, EventArgs.Empty);
        }

        public void Clear(bool watchEntry = false)
        {
            this.context.ClearAllTimers();
            UnloadAddIns();
            if (this.engine != null)
            {
                this.engine.Interrupt();
                // this.engine.CollectGarbage(true);
                this.engine.Dispose();
                this.engine = null;
            }
            this.fileWatcherService.Clear();
            if (watchEntry && !string.IsNullOrEmpty(this.lastRun?.ScriptPath))
                this.fileWatcherService.Add(ResolveRelativeScriptPath(this.lastRun?.ScriptPath));
        }
        
        public ClearScriptExecutionEngine SetAddIns(Func<List<IAddIn>, List<IAddIn>> register)
        {
            var list = new List<IAddIn>();
            register(list);
            SetAddIns(list.ToArray());
            return this;
        }

        public void SetAddIns(params IAddIn[] addIns)
        {
            var addInsObject = new ExpandoObject() as IDictionary<string, object>;
            foreach (var addIn in addIns) addInsObject[addIn.Name] = addIn.AddInObject;
            this.context.AddIns = addInsObject;
            this.AddIns = addIns.ToList();

            if (this.IsRunning) Reload();
        }

        public void AddObject(string key, object obj)
        {
            this.AddedObjects[key] = obj;
            this.engine?.AddHostObject(key, obj);
        }

        public void AddType(Type type, string key)
        {
            void Action(V8ScriptEngine e) => e.AddHostType(key, type);
            this.AddTypes.Add(Action);
            if (this.engine != null)
                Action(this.engine);
        }
        public void AddType(Type type)
        {
            void Action(V8ScriptEngine e) => e.AddHostType(type);
            this.AddTypes.Add(Action);
            if (this.engine != null)
                Action(this.engine);
        }

        public void SetAssemblyBundle(string bundleName, params Assembly[] assemblies)
        {
            this.assemblyBundleName = bundleName;
            foreach (var assembly in assemblies)
            {
                this.AddAssemblies.Add(assembly);
            }
        }

        private void AddObjects()
        {
            foreach (var kp in this.AddedObjects) this.engine.AddHostObject(kp.Key, kp.Value);

            foreach (var addType in this.AddTypes) addType(this.engine);

            if (this.AddAssemblies.Any())
            {
                this.engine.AddHostObject(this.assemblyBundleName,
                    new HostTypeCollection(this.AddAssemblies.ToArray()));
            }
        }

        public T GetObject<T>(Func<dynamic, T> get)
        {
            if (this.engine == null)
                throw new Exception("Engine is not running");
            
            return get(this.engine.Script);
        }

        private string GetBootstrapScript()
        {
            // TODO: add cache
            var bootstrapText = ReadScriptFromResources("clear.bootstrap.js");
            var template = ReadScriptFromResources("addin.template.js");

            var addinsText = string.Join(Environment.NewLine,
                AddIns
                    .Where(a => !string.IsNullOrEmpty(a.RegisterStatement))
                    .Select(a => template
                        .Replace("$NAME$", a.Name)
                        .Replace("//script", a.RegisterStatement)
                    )
            );

            return bootstrapText.Replace("/**ADD-INS**/", "/**ADD-INS**/\n" + addinsText);
        }

        private void ContextOnOnScriptHanged(object sender, EventArgs e)
        {
            this.OnScriptHanged?.Invoke(this, e);
        }

        private void OnFileChanged(object sender, EventArgs e)
        {
            Reload();
        }

        private void UnloadAddIns()
        {
            foreach (var addIn in this.AddIns) 
                addIn.OnScriptUnload();
        }

        private static V8ScriptEngineFlags MapFlags(ExecutionDebugFlags flags)
        {
            const V8ScriptEngineFlags baseFlags = V8ScriptEngineFlags.EnableTaskPromiseConversion
                                                  | V8ScriptEngineFlags.EnableValueTaskPromiseConversion;
            return flags switch
            {
                ExecutionDebugFlags.Debug => V8ScriptEngineFlags.EnableDebugging | baseFlags,
                ExecutionDebugFlags.DebugAndWait => V8ScriptEngineFlags.EnableDebugging
                                                    | V8ScriptEngineFlags.AwaitDebuggerAndPauseOnStart
                                                    | baseFlags,
                _ => baseFlags
            };
        }

        private string ResolveRelativeScriptPath(string relativeScriptPath) => relativeScriptPath == null 
            ? null 
            : PathEx.CombineAndNormalize(this.context.BasePath, relativeScriptPath);

        internal static string ReadScriptFromResources(string name)
        {
            var ass = typeof(ClearScriptExecutionEngine).Assembly;
            using var sr = new StreamReader(ass.GetManifestResourceStream($"{ass.GetName().Name}.Js.{name}"));
            return sr.ReadToEnd();
        }
    }
}