const addinCtx = ctx.AddIns.LocalStorage;

globalThis.localStorage = new class {
    setItem(key, value) {
        addinCtx.SetItem(key, JSON.stringify(value, null, 2));
    }
    getItem(key) {
        let result = addinCtx.GetItem(key);
        if (result === "undefined") {
            return undefined;
        }
        if (!result) { return result; }
        return JSON.parse(result);
    }
    removeItem(key) {
        addinCtx.RemoveItem(key);
    }
    clear() {
        addinCtx.Clear();
    }
}