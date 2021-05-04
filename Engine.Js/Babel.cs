using Microsoft.ClearScript.V8;

namespace Engine.Js
{
    internal class Babel
    {
        private readonly V8ScriptEngine engine;

        public Babel()
        {
            this.engine = new V8ScriptEngine();
            this.engine.Execute(ClearScriptExecutionEngine.ReadScriptFromResources("babel.standalone.js"));
            this.engine.Execute(ClearScriptExecutionEngine.ReadScriptFromResources("babel.transform.js"));
        }

        public string Transpile(string filename, string script)
        {
            if (filename.EndsWith(".js")) return script;
            
            var result = this.engine.Script.transform(filename, script, true);
            return (string)result.code;
        }
    }
}