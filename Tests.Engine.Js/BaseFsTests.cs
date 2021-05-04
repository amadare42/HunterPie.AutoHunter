using System;
using System.IO;
using System.Linq;
using System.Reflection;
using Engine.Js;
using Xunit.Abstractions;

namespace Tests.Engine.Js
{
    public class BaseFsTests : IDisposable
    {
        protected readonly ITestOutputHelper Output;
        protected string BasePath;
        protected virtual bool AttachDebuggerByDefault { get; set; }

        public BaseFsTests(ITestOutputHelper testOutputHelper)
        {
            this.Output = testOutputHelper;
            var assemblyLocation = Path.GetDirectoryName(typeof(BaseFsTests).Assembly.Location);
            var testFilesLocation = Path.Combine(assemblyLocation, "testfiles");
            var testName = GetTestName();
            this.BasePath = Path.Combine(testFilesLocation, testName);
            
            if (Directory.Exists(this.BasePath)) Directory.Delete(this.BasePath, true);
            Directory.CreateDirectory(this.BasePath);
        }

        private string GetTestName()
        {
            var type = this.Output.GetType();
            var testMember = type.GetField("test", BindingFlags.Instance | BindingFlags.NonPublic);
            var test = (ITest)testMember.GetValue( this.Output);
            
            return test.DisplayName;
        }
        
        public ClearScriptExecutionEngine CreateEngine(bool? waitForDebugger = null)
        {
            return CreateEngine(null, waitForDebugger);
        }

        public ClearScriptExecutionEngine CreateEngine(Action<ClearScriptExecutionEngine> init, bool? waitForDebugger = null)
        {
            var sut = new ClearScriptExecutionEngine(this.BasePath);
            init?.Invoke(sut);
            sut.Init(this.AttachDebuggerByDefault || (waitForDebugger == true) ? ExecutionDebugFlags.DebugAndWait : ExecutionDebugFlags.Debug);
            sut.OnLog += (_, args) => this.Output.WriteLine(args.Text);
            sut.OnExecutionError += (_, args) => this.Output.WriteLine($"Execution error: {args.JsError ?? args.Exception.ToString()}");
            sut.IsDebug = true;
            
            return sut;
        }

        public void CreateFile(string relativePath, string code)
        {
            relativePath = relativePath.Replace('/', '\\');
            var parts = relativePath.Split('\\', '/').ToArray();

            var fullPath = this.BasePath;
            foreach (var pathPart in parts.Take(parts.Length - 1))
            {
                fullPath = Path.Combine(fullPath, pathPart);
                if (!Directory.Exists(fullPath)) Directory.CreateDirectory(fullPath);
            }

            fullPath = Path.Combine(fullPath, parts.Last());
            File.WriteAllText(fullPath, code);
        }

        public void ChangeFile(string relativePath, string code)
        {
            relativePath = relativePath.Replace('/', '\\');
            var fullPath = Path.Combine(this.BasePath, relativePath);
            File.WriteAllText(fullPath, code);
        }

        public void Dispose()
        {
            Directory.Delete(this.BasePath, true);
        }
    }
}