using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Engine.Js;
using Engine.Js.AddIns;
using Microsoft.ClearScript.JavaScript;
using Newtonsoft.Json;
using Tests.Engine.Js.TestModel;
using Xunit;
using Xunit.Abstractions;

namespace Tests.Engine.Js
{
    public class ClearScriptTests : BaseFsTests
    {
        protected override bool AttachDebuggerByDefault { get; set; } = false;

        [Fact]
        public void Console_HookedToEvents()
        {
            // arrange
            List<string> loggedValues = new();

            var sut = CreateEngine();
            sut.OnLog += (sender, args) => loggedValues.Add(args.Text);
            sut.OnLogsClear += (_, _) => loggedValues.Add("<cleared>");

            // act
            CreateFile("script.js", @"console.log('test'); 
console.log(42); 
console.log([1,2,3]);
console.log({ foo: { bar: 'complexValue' } });
console.clear();
");
            sut.RunScript("script.js");

            // assert
            Assert.Collection(loggedValues,
                i => Assert.Equal("test", i),
                i => Assert.Equal("42", i),
                i => Assert.Equal("[1,2,3]", i),
                i => Assert.Contains("complexValue", i),
                i => Assert.Contains("<cleared>", i)
            );
        }

        [Fact]
        public void Import_CanImportModules()
        {
            // arrange
            var sut = CreateEngine();
            var logs = ListenLogs(sut);

            CreateFile("script.js", @"
import { getValue } from 'module-a.js'; 
import { getValue as getValue2 } from 'module-a.js';

console.log('script.js');

console.log(getValue());
console.log(getValue2());
");
            CreateFile("module-a.js", @"

console.log('module-a.js'); 
let value = 0;
export function getValue() { return value++; };
");

            // act
            sut.RunScript("script.js");

            // assert
            Assert.Collection(logs,
                i => Assert.Equal("module-a.js", i),
                i => Assert.Equal("script.js", i),
                i => Assert.Equal("0", i),
                i => Assert.Equal("1", i)
            );
        }

        [Fact]
        public void Import_CanImportModulesInSubDirectories()
        {
            // arrange
            var sut = CreateEngine();
            var logs = ListenLogs(sut);

            CreateFile("script.js", @"
import 'foo';
");
            CreateFile("foo/index.js", @"
import 'bar.js';
");
            CreateFile("foo/bar.js", @"
console.log('bar!');
");

            // act
            sut.RunScript("script.js");

            // assert
            Assert.Collection(logs,
                i => Assert.Equal("bar!", i)
            );
        }

        [Fact]
        public void ImportedModules_HaveAccessToInjectedObjects()
        {
            // arrange
            var sut = CreateEngine();
            var logs = ListenLogs(sut);
            sut.AddObject("obj", new {value = 42});

            CreateFile("script.js", "import 'foo.js'; console.log(obj.value);");
            CreateFile("foo.js", "console.log(obj.value);");

            // act
            sut.RunScript("script.js");

            // assert
            Assert.Collection(logs,
                i => Assert.Equal("42", i),
                i => Assert.Equal("42", i)
            );
        }

        [Fact]
        public void Watch_ForRootScript()
        {
            // arrange
            var sut = CreateEngine();
            var logs = ListenLogs(sut);
            var reloadEvent = new AutoResetEvent(false);
            sut.OnFileReloaded += (_, _) => reloadEvent.Set();

            CreateFile("script.js", "console.log(1);");

            // act
            sut.RunScript("script.js");
            ChangeFile("script.js", "console.log(2);");
            reloadEvent.WaitOne(5000);

            // assert
            Assert.Collection(logs,
                i => Assert.Equal("1", i),
                i => Assert.Equal("2", i)
            );
        }

        [Fact]
        public void Watch_ForImportedScript()
        {
            // arrange
            var sut = CreateEngine();
            var logs = ListenLogs(sut);
            var reloadEvent = new AutoResetEvent(false);
            sut.OnFileReloaded += (_, _) => reloadEvent.Set();

            CreateFile("script.js", "import 'foo'");
            CreateFile("foo/index.js", "console.log(1);");

            // act
            sut.RunScript("script.js");
            ChangeFile("foo/index.js", "console.log(2);");
            reloadEvent.WaitOne(5000);

            // assert
            Assert.Collection(logs,
                i => Assert.Equal("1", i),
                i => Assert.Equal("2", i)
            );
        }

        [Fact]
        public async Task Watch_TerminatesRunningScripts()
        {
            // arrange
            var sut = CreateEngine();
            var logs = ListenLogs(sut);
            var reloadEvent = new AutoResetEvent(false);
            sut.OnFileReloaded += (_, _) => reloadEvent.Set();

            var tcs = new TaskCompletionSource<object>();
            sut.AddObject("state", new { task = tcs.Task });

            CreateFile("script.js", "state.task.then(() => console.log('task callback'))");

            // act
            sut.RunScript("script.js");
            ChangeFile("script.js", "console.log('reloaded')");
            reloadEvent.WaitOne(5000);
            tcs.SetResult(null);
            // making sure timeout finished
            await Task.Delay(700);

            // assert
            Assert.Collection(logs,
                i => Assert.Equal("reloaded", i)
            );
        }

        [Fact]
        public void Interop_IsFastEnough()
        {
            // arrange
            var sut = CreateEngine();
            var iterations = 10000;
            var times = new List<long>(iterations);
            var sw = new Stopwatch();
            sut.AddObject("call", new Action(() =>
            {
                times.Add(sw.ElapsedTicks);
                sw.Restart();
            }));

            CreateFile("script.js", @"
for (let i = 0; i < " + iterations + @"; i++) {
    call();
}");

            // act
            sut.RunScript("script.js");

            // assert
            var avg = times.Skip(1).Sum() / iterations;
            this.Output.WriteLine(avg.ToString());
            Assert.InRange(avg, -1, TimeSpan.TicksPerMillisecond / 10);
        }

        [Fact]
        public async Task Delay_IsAccurateEnough()
        {
            // arrange
            const int iterations = 50;
            const int delay = 25;

            var sut = CreateEngine(e => e.SetAddIns(a => a.AddDelays()));
            CreateFile("script.js", $@"
var p = Promise.resolve();

var times = [];
function call() {{ times.push(Date.now()); }}
for (let i = 0; i < {iterations}; i++) {{
    p = p.then(() => delay({delay})).then(call);
}}
globalThis.promise = p.then(() => JSON.stringify(times));");

            // act
            sut.RunScript("script.js");
            var resultJson = (string) await Task.Run(() => sut.GetObject<Task<object>>(script => script.promise));

            // assert
            var times = JsonConvert.DeserializeObject<long[]>(resultJson);
            var prevTime = times[0];
            var overheadTimes = times.Skip(1)
                .Select(time =>
                {
                    // subtract actual requested delay
                    var delta = (time - prevTime) - delay;
                    prevTime = time;
                    return delta;
                }).ToArray();
            var avg = overheadTimes.Average();

            this.Output.WriteLine(avg.ToString());

            // 1 ms delay max
            Assert.InRange(avg, -1, 1);
        }

        [Fact]
        public async Task Wait_IsAccurateEnough()
        {
            // arrange
            const int iterations = 50;
            const int delay = 25;

            var sut = CreateEngine();
            CreateFile("script.js", $@"
var p = Promise.resolve();

var times = [];
function call() {{ times.push(Date.now()); }}
for (let i = 0; i < {iterations}; i++) {{
    wait({delay});
    call();
}}
globalThis.timesJson = JSON.stringify(times);");

            // act
            sut.RunScript("script.js");

            // assert
            var resultJson = await Task.Run(() => sut.GetObject<string>(script => script.timesJson));
            var times = JsonConvert.DeserializeObject<long[]>(resultJson);
            var prevTime = times[0];
            var overheadTimes = times.Skip(1)
                .Select(time =>
                {
                    // subtract actual requested delay
                    var delta = (time - prevTime) - delay;
                    prevTime = time;
                    return delta;
                }).ToArray();
            var avg = overheadTimes.Average();

            this.Output.WriteLine(avg.ToString());

            // 1 ms delay max
            Assert.InRange(avg, -1, 1);
        }
        
        [Fact]
        public async Task HangedScript_WillFireEvent()
        {
            // arrange
            var hanged = false;
            var sut = CreateEngine();
            sut.OnScriptHanged += (_, _) => hanged = true;
            CreateFile("script.js", @"while (true) {}");
            
            // act
            var execution = Task.Run(() => sut.RunScript("script.js"));
            var timeout = Task.Delay(2000);
            await Task.WhenAny(execution, timeout);
            
            // assert
            Assert.True(hanged);
        }
        
        [Fact]
        public async Task HangedScript_WillNotFireEventOnWait()
        {
            // arrange
            var hanged = false;
            var sut = CreateEngine();
            sut.OnScriptHanged += (_, _) => hanged = true;
            CreateFile("script.js", @"wait(2001);");
            
            // act
            var execution = Task.Run(() => sut.RunScript("script.js"));
            var timeout = Task.Delay(2000);
            await Task.WhenAny(execution, timeout);
            
            // assert
            Assert.False(hanged);
        }

        [Fact]
        public void Typescript_IsTranspiled()
        {
            // arrange
            var sut = CreateEngine();
            var logs = ListenLogs(sut);
            
            CreateFile("script.ts", @"import './sub-script'; interface IFoo {} console.log(1);");
            CreateFile("sub-script.ts", @"interface IFoo {} console.log(2);");
            
            // act
            sut.RunScript("script.ts");
            
            // assert
            Assert.Collection(logs, 
                msg => Assert.Equal("2", msg),
                msg => Assert.Equal("1", msg)
            );
        }

        [Fact]
        public void Event_WillBeTriggered()
        {
            // arrange
            var eventContainer = new TestEventContainer
            {
                TestValue = "container value"
            };
            var registrar = new TestEventRegistrar(_ => eventContainer);
            var sut = CreateEngine(e => e.SetAddIns(a => a.AddEventHandling(registrar)));
            var logs = ListenLogs(sut);
            var onDone = RegisterDoneCb(sut);
            
            CreateFile("script.js", @"
registerEvent('Test.Event.OnEvent', (args) => { console.log(args.Value) });
registerEvent('Test.Event.OnEvent', (sender, args) => { console.log(sender.TestValue, args.Value); done(); }, true);
");

            // act
            sut.RunScript("script.js");
            eventContainer.Invoke(new TestEventArgs { Value = 42 });
            onDone.WaitOne();
            
            // assert
            Assert.Collection(logs, 
                log => Assert.Equal("42", log),
                log => Assert.Equal("container value, 42", log)
            );
        }
        
        [Fact]
        public void Event_WillNotBeTriggered_WhenRaisingDisabled()
        {
            // arrange
            var eventContainer = new TestEventContainer();
            var registrar = new TestEventRegistrar(_ => eventContainer);
            registrar.EnableRaisingEvents = false;
            
            var sut = CreateEngine(e => e.SetAddIns(a => a.AddEventHandling(registrar)));
            var logs = ListenLogs(sut);
            
            CreateFile("script.js", @"
registerEvent('Test.Event.OnEvent', (args) => { console.log(args.Value) });
");

            // act
            sut.RunScript("script.js");
            eventContainer.Invoke(new TestEventArgs { Value = 42 });
            
            // assert
            Assert.Collection(logs);
        }

        [Fact]
        public void Event_OnError_ShouldNotThrow()
        {
            // arrange
            var eventContainer = new TestEventContainer();
            var registrar = new TestEventRegistrar(_ => eventContainer);
            
            var sut = CreateEngine(e => e.SetAddIns(a => a.AddEventHandling(registrar)));
            var logs = ListenLogs(sut);
            
            CreateFile("script.js", @"
registerEvent('Test.Event.OnEvent', (args) => { throw new Error('error!'); });
");

            // act
            sut.RunScript("script.js");
            eventContainer.Invoke(new TestEventArgs());
            
            // assert
            Assert.Collection(logs, log => Assert.Contains("error!", log));
        }

        [Fact]
        public void AddIn_InjectsObject()
        {
            // arrange
            var sut = CreateEngine(engine => engine.SetAddIns(new TestAddIn
            {
                RegisterStatement = "globalThis.addInValue = 42;"
            }));
            var logs = ListenLogs(sut);
            
            CreateFile("script.js", "console.log(42);");
            
            // act
            sut.RunScript("script.js");
            
            // assert
            Assert.Collection(logs, log => Assert.Equal("42", log));
        }
        
        [Fact]
        public void AddIn_HaveAccessToCtx()
        {
            // arrange
            var called = false;
            var sut = CreateEngine(engine => engine.SetAddIns(new TestAddIn
            {
                Name = "Test",
                RegisterStatement = "globalThis.setCalled = ctx.AddIns.Test.setCalled;",
                AddInObject = new
                {
                    setCalled = new Action(() => called = true)
                }
            }));
            
            CreateFile("script.js", "setCalled();");
            
            // act
            sut.RunScript("script.js");
            
            // assert
            Assert.True(called);
        }
        
        [Fact]
        public async Task AddIn_AddedOnReload()
        {
            // arrange
            List<string> logs = null;
            var are = new AutoResetEvent(false);
            var sut = CreateEngine(engine =>
            {
                logs = ListenLogs(engine);
                engine.SetAddIns(new TestAddIn
                {
                    RegisterStatement = @"
globalThis.val = 42;
globalThis.done = ctx.AddIns.Test.done;",
                    AddInObject = new
                    {
                        done = new Action(() => are.Set())
                    }
                });
            });
            
            CreateFile("script.js", "console.log(val++);");
            
            // act
            await Task.Run(() => sut.RunScript("script.js"));
            ChangeFile("script.js", "console.log(val + 1); done();");

            await Task.Run(() => are.WaitOne());
            
            // assert
            Assert.Collection(logs, 
                log => Assert.Equal("42", log),
                log => Assert.Equal("43", log)
            );
        }

        [Fact]
        public void Arrays_AreConverted()
        {
            // arrange
            var sut = CreateEngine();
            sut.AddObject("array", new[] { 1, 2, 3 });
            var logs = ListenLogs(sut);
            
            CreateFile("script.js", "console.log(Array.from(array).filter(a => a > 1).length);");
            
            // act
            sut.RunScript("script.js");
            
            // assert
            Assert.Collection(logs, log => Assert.Equal("2", log));
        }

        [Fact]
        public void Enums_AreConverted()
        {
            // arrange
            var sut = CreateEngine();
            sut.AddObject("myval", TestEnum.Bar);
            var logs = ListenLogs(sut);
            
            CreateFile("script.js", "console.log(myval.ToString());");
            
            // act
            sut.RunScript("script.js");
            
            // assert
            Assert.Collection(logs, log => Assert.Equal("Bar", log));
        }
        
        [Fact]
        public void Tasks_AreConverted()
        {
            // arrange
            var sut = CreateEngine();
            object obj = null;
            sut.AddObject("setValue", new Action<object>(o => obj = o));
            
            CreateFile("script.js", "setValue(Promise.resolve(42));");
            
            // act
            sut.RunScript("script.js");
            
            // assert
            Assert.IsType(typeof(Task<object>), obj);
            Assert.Equal(42, ((Task<object>)(obj)).Result);
        }

        [Fact]
        public void AwaitedPromise_WillNotTriggerAfterScriptReset()
        {
            // arrange
            var sut = CreateEngine();
            var are = new TaskCompletionSource<object>();
            var state = new
            {
                task = are.Task
            };
            sut.AddObject("state", state);
            var logs = ListenLogs(sut);
            
            CreateFile("script.js", "state.task.then(() => console.log('triggered!'))");
            
            // act
            sut.RunScript("script.js");
            sut.Reset();
            are.SetResult(null);
            
            // assert
            Assert.Empty(logs);
        }

        [Fact]
        public void Error_ShouldTriggerEvent()
        {
            // arrange
            var sut = CreateEngine();
            var triggered = false;
            sut.OnExecutionError += (_, _) => triggered = true;

            CreateFile("script.js", "#invalid script");
            
            // act
            sut.RunScript("script.js");
            
            // assert
            Assert.True(triggered);
        }

        [Fact]
        public void FaultyScript_ReloadsAfterChange()
        {
            // arrange
            var sut = CreateEngine();
            var done = RegisterDoneCb(sut);
            var logs = ListenLogs(sut);

            CreateFile("script.js", "#invalid script");
            
            // act
            sut.RunScript("script.js");
            ChangeFile("script.js", "console.log('reloaded'); done();");
            done.WaitOne(5000);
            
            // assert
            Assert.Collection(logs, log => Assert.Equal("reloaded", log));
        }

        [Fact]
        public void ByteArrays_Converted()
        {
            // arrange
            var sut = CreateEngine();
            byte[] returnedValue = null; 
            sut.AddObject("state", new
            {
                act = new Action<byte[]>(v => returnedValue = v)
            });
            CreateFile("script.js", @"
var byteType = host.type('System.Byte');
var array = host.newArr(byteType, 2);
array[0] = host.toByte(1);
array[1] = host.toByte(2);
state.act(array);
");
            
            // act
            sut.RunScript("script.js");
            
            // assert
            Assert.Equal(new byte[] { 1, 2 }, returnedValue);
        }
        
        [Fact]
        public void ByteArrays_ConvertedFromTypedArrays()
        {
            // arrange
            var sut = CreateEngine(e => e.SetAddIns(a => a.AddBinaryHelpers()));
            byte[] returnedValue = null; 
            sut.AddObject("state", new
            {
                act = new Action<byte[]>(v => returnedValue = v)
            });
            
            CreateFile("script.js", @"
var arr = new Uint16Array(2);
arr[0] = 1;
arr[1] = 2;

var byteArray = toByteArray(arr);

state.act(byteArray);
");
            
            // act
            sut.RunScript("script.js");
            
            // assert
            Assert.Equal(new byte[] { 1, 0, 2, 0 }, returnedValue);
        }

        [Fact]
        public void EventHandlingError_ProvideErrorInConsole()
        {
            // arrange
            var eventContainer = new TestEventContainer();
            var registrar = new TestEventRegistrar(e => eventContainer);
            var sut = CreateEngine(e => e.SetAddIns(a => a.AddEventHandling(registrar)));
            sut.AddObject("state", new
            {
                container = eventContainer
            });

            var logs = ListenLogs(sut);
            CreateFile("script.js", @"registerEvent(state.container.OnEvent, () => { throw new Error('staged error'); })");
            
            // act
            sut.RunScript("script.js");
            eventContainer.Invoke(EventArgs.Empty);
            
            // assert
            Assert.Collection(logs, l =>
            {
                Assert.Contains("staged error", l);
                Assert.Contains(nameof(TestEventContainer), l);
            });
        }

        [Fact]
        public void LocalStorage_IsMocked()
        {
            // arrange
            var path = Path.Combine(this.BasePath, "localstorage.json");
            var sut = CreateEngine(e => e.SetAddIns(a => a.AddLocalStorage(new SingleFileLocalStorageProvider(path))));
            var logs = ListenLogs(sut);
            
            CreateFile("script.js", @"
localStorage.setItem('key', { a: 42, f: function() { } });
console.log(localStorage.getItem('key').a);
console.log('' + localStorage.getItem('key').f);
");
            
            // act
            sut.RunScript("script.js");
            
            // assert
            this.Output.WriteLine(File.ReadAllText(path));
            Assert.Collection(logs, 
                l => Assert.Equal("42", l),
                l => Assert.Equal("undefined", l)
            );
        }

        [Fact(Skip = "only manual")]
        public void MessageBox_CanBeCalled()
        {
            // arrange
            var sut = CreateEngine();
            sut.AddType(typeof(System.Windows.MessageBox));
            
            CreateFile("script.js", @"
    const clr = host.lib('PresentationFramework', 'System.Windows');
    const MessageBoxButton = clr.System.Windows.MessageBoxButton;
    MessageBox.Show('my msg', ""Automated message"", MessageBoxButton.OK);
");
            
            // act
            sut.RunScript("script.js");
        }

        private static List<string> ListenLogs(ClearScriptExecutionEngine engine)
        {
            var list = new List<string>();
            engine.OnLog += (_, args) =>
            {
                if (args.IsDebug) return;
                list.Add(args.Text);
            };
            return list;
        }

        private static AutoResetEvent RegisterDoneCb(ClearScriptExecutionEngine engine, string key = "done")
        {
            var are = new AutoResetEvent(false);
            engine.AddObject(key, new Action(() => are.Set()));
            return are;
        }

        public ClearScriptTests(ITestOutputHelper testOutputHelper) : base(testOutputHelper)
        {
        }
    }

    public enum TestEnum
    {
        Foo, Bar
    }

    public class TestAddIn : IAddIn
    {
        public string Name { get; set; } = "Test";
        public string RegisterStatement { get; set; }
        public object AddInObject { get; set;  }
        public void OnScriptUnload()
        {
        }
    }
}