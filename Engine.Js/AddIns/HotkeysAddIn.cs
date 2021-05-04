using System;
using System.Collections.Generic;

namespace Engine.Js.AddIns
{
    public class HotkeysAddIn : IAddIn
    {
        private readonly IHotkeysProvider hotkeys;
        public string Name => "Hotkeys";
        public string RegisterStatement => ClearScriptExecutionEngine.ReadScriptFromResources("AddIns.hotkeys.js");
        public object AddInObject => this.hotkeys;


        public HotkeysAddIn(IHotkeysProvider hotkeys)
        {
            this.hotkeys = hotkeys;
        }

        public void OnScriptUnload()
        {
            this.hotkeys.UnregisterAll();
        }
    }

    public class HotkeyEventArgs : EventArgs
    {
        public string Key { get; set; }
    }
    
    public interface IHotkeysProvider
    {
        event EventHandler<HotkeyEventArgs> OnHotkey; 
        
        string Register(string key);

        void Unregister(string id);

        void UnregisterAll();
    }
}