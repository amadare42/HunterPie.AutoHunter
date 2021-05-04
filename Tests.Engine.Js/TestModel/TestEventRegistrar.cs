using System;
using Engine.Js;
using Engine.Js.AddIns;

namespace Tests.Engine.Js.TestModel
{
    public class TestEventRegistrar : IEventRegistrar
    {
        private readonly Func<string, object> resolve;
        public bool EnableRaisingEvents { get; set; } = true;

        public TestEventRegistrar(Func<string, object> resolve)
        {
            this.resolve = resolve;
        }

        public object GetEventContainer(string eventKey)
        {
            return this.resolve(eventKey);
        }
    }
}