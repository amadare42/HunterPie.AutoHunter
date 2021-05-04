namespace Engine.Js.AddIns
{
    public class BinaryHelpersAddin : IAddIn
    {
        public string Name => "BinaryHelpers";
        public string RegisterStatement => ClearScriptExecutionEngine.ReadScriptFromResources("AddIns.binary.js");
        public object AddInObject => null;
        
        public void OnScriptUnload()
        {
        }
    }
}