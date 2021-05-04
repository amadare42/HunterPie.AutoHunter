namespace Engine.Js.AddIns
{
    public interface IAddIn
    {
        string Name { get; }
        
        string RegisterStatement { get; }
        
        object AddInObject { get; }
        
        void OnScriptUnload();
    }
}