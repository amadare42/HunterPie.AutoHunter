using System.Collections.Generic;

namespace Engine.Js.AddIns
{
    public static class AddInExtensions
    {
        public static List<IAddIn> AddEventHandling(this List<IAddIn> engine,
            IEventRegistrar registrar)
        {
            var addIn = new EventRegisteringAddIn(registrar);
            engine.Add(addIn);
            return engine;
        }
        
        public static List<IAddIn> AddHotkeys(this List<IAddIn> engine,
            IHotkeysProvider hotkeys)
        {
            var addIn = new HotkeysAddIn(hotkeys);
            engine.Add(addIn);
            return engine;
        }

        public static List<IAddIn> AddBinaryHelpers(this List<IAddIn> engine)
        {
            var addIn = new BinaryHelpersAddin();
            engine.Add(addIn);
            return engine;
        }

        public static List<IAddIn> AddLocalStorage(this List<IAddIn> engine, ILocalStorageProvider localStorageProvider)
        {
            var addIn = new LocalStorageAddIn(localStorageProvider);
            engine.Add(addIn);
            return engine;
        }

        public static List<IAddIn> AddDelays(this List<IAddIn> engine, IDelayModContainer container = null)
        {
            var addIn = container == null
                ? new DelayAddIn()
                : new DelayAddIn(container);
            
            engine.Add(addIn);
            return engine;
        }
    }
}