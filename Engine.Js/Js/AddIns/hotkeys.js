let addInCtx = ctx.AddIns.Hotkeys;

let registeredHotkeys = {};

globalThis.registerHotkey = function registerHotkey(key, cb) {
    try {
        var keyId = addInCtx.Register(key);
        (registeredHotkeys[keyId] || (registeredHotkeys[keyId] = [])).push(cb);
        return {
            keyId,
            unregister() {
                addInCtx.Unregister(this.keyId);
                delete registeredHotkeys[this.keyId];
            }
        }
    } catch (e) {
        console.log(e.toString());
        return {
            unregister() {}
        }
    }
};

addInCtx.OnHotkey.connect((_, args) => {
    var cbs = registeredHotkeys[args.Key];
    if (!cbs) return;
    for (let cb of cbs) {
        try {
            cb();
        } catch (e) {
            console.log(e);
        }
    }
})

ctx.OnReset.connect(() => {
    registeredHotkeys = {};
    // unregister hotkeys is expected to be handled on clr part
});