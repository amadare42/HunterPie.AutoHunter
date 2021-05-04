namespace Engine.Js.AddIns
{
    public interface IDelayModContainer
    {
        double Mult { get; }
        int Offset { get; }
    }
    
    public class DelayAddIn : IAddIn, IDelayModContainer
    {
        private readonly IDelayModContainer container;
        public string Name => "Delay";
        public string RegisterStatement => ClearScriptExecutionEngine.ReadScriptFromResources("AddIns.delay.js");
        public object AddInObject => this.container;

        public DelayAddIn(IDelayModContainer container)
        {
            this.container = container;
        }
        
        public DelayAddIn()
        {
            this.container = this;
        }

        public void OnScriptUnload()
        {
        }

        public double Mult { get; set; } = 1;
        public int Offset { get; set;  } = 0;
    }
}