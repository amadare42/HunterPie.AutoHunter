namespace Engine.Js.AddIns
{
    public interface IEventRegistrar
    {
        bool EnableRaisingEvents { get; }
        
        object GetEventContainer(string eventKey);
    }
    
    public class NullEventRegistrar : IEventRegistrar
    {
        public bool EnableRaisingEvents { get; }
        
        public object GetEventContainer(string eventKey)
        {
            return null;
        }
    }
    
    public class EventRegisteringAddIn : IAddIn
    {
        private readonly IEventRegistrar eventRegistrar;
        
        public string Name => "Events";
        public string RegisterStatement => ClearScriptExecutionEngine.ReadScriptFromResources("AddIns.events.js");
        public object AddInObject => this.eventRegistrar;
        

        public EventRegisteringAddIn(IEventRegistrar eventRegistrar)
        {
            this.eventRegistrar = eventRegistrar;
        }

        public void OnScriptUnload()
        {
        }
    }
}