// this file expected to be function expression

/**
 * @typedef {{ 
 *      WriteLine: function(text: string, isDebug: boolean): void,
 *      Clear: function(): void,
 *
 *      Wait: function(delay: number): void,
 *      SetTimeout: function(cb: function, delay: number, isDelay: boolean): number,
 *      SetInterval: function(cb: function, delay: number): number,
 *      ClearTimer: function(id: number): void,
 *
 *      AddIns: any,
 *      SetKeepAliveCb: function(cb: function): void,
 *      OnReset: any
 * }} InitContext
 */


(/** @param ctx {InitContext} */(ctx) => {
    
    function wrapConsole() {
        var _console = console;
        
        function argToString(arg) {
            if (typeof arg == "string") {
                return arg;
            }
            if (arg instanceof Error) {
                return arg.toString();
            }
            try {
                return JSON.stringify(arg)
            } catch(e) {}
            
            if ('ToString' in arg) {
                return arg.ToString();
            }
            
            return arg.toString();
        }
        
        function log(...args) {
            // NOTE: to see actual file that called this log, blackbox this script
            let text = args.map(argToString).join(', ');
            ctx.WriteLine(text, false);
            _console.log(...args);
        }
        
        function clear() {
            ctx.Clear();
            _console.clear();
        }
        
        function debug() {
            if (ctx.IsDebug) {
                let text = args.map(argToString).join(', ');
                ctx.WriteLine(text, true);
            }
            _console.debug(...arguments);
        }
        
        console = new Proxy(console, {
            get(target, prop) {
                switch (prop) {
                    case 'log': return log;
                    case 'error': return log;
                    case 'clear': return clear;
                    case 'debug': return debug;
                    default: return _console[prop];
                }
            }
        })
    }
    
    function defineHostFunction() {
        globalThis.wait = ctx.Wait;
        globalThis.setTimeout = ctx.SetTimeout
        globalThis.setInterval = ctx.SetInterval
        globalThis.clearInterval = globalThis.clearTimeout = ctx.ClearTimer;
        
        globalThis.delay = function delay(ms, silent = false) {
            let promise = new Promise(r => ctx.SetTimeout(r, ms, true));
            if (!silent) {
                console.log(`[DELAY] ${ms}`);
            }
            return promise;
        };
        
        globalThis.require = function require() {
            throw new Error("require isn't supported, use ES6 import instead!")
        }
    }
    
    wrapConsole();
    defineHostFunction();
    ctx.SetKeepAliveCb(() => {});
    
    /**ADD-INS**/
})