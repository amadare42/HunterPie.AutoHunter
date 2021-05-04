let addInCtx = ctx.AddIns.Delay;

globalThis.delay = function delay(ms, opts = false) {
    let silent = false;
    let constant = false;
    
    if (typeof opts == 'boolean') {
        silent = opts;
    } else {
        silent = opts.silent === undefined ? false : opts.silent;
        constant = opts.constant === undefined ? false : opts.constant;
    }
    
    let actualMs = constant ? ms : parseInt(ms * addInCtx.Mult + addInCtx.Offset);
    if (isNaN(actualMs)) {
        actualMs = ms;
    } else if (actualMs <= 0) {
        actualMs = 1;
    }
    let promise = new Promise(r => ctx.SetTimeout(r, actualMs, true));
    if (!silent) {
        let modStr = actualMs !== ms 
            ? [
                ` (${ms}`, 
                addInCtx.Mult !== 1 ? ` * ${addInCtx.Mult}` : '',
                addInCtx.Offset ? ` + ${addInCtx.Offset}` : '',
                ')'
            ].join('')
            : '';
        console.log(`[DELAY] ${actualMs}${modStr}`);
    }
    return promise;
};