using System;

namespace Tests.Engine.Js.TestModel
{
    public class TestEventContainer
    {
        public object TestValue { get; set; }
        public event EventHandler<EventArgs> OnEvent;

        public void Invoke(EventArgs args)
        {
            this.OnEvent?.Invoke(this, args);
        }
    }
}