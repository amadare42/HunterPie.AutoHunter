import {alignAngleTo, goTo} from "./walking";
import {waitUntilPlayerIsControllable} from "./index";

export async function executeRecord(record, callbacks = {}) {
    const { before, after } = callbacks;
    let log = createStickyLog("Record:", "record");
    for (let i = 0; i < record.length; i++) {
        let [type, data] = record[i];
        
        if (before) {
            let rsp = await before(record[i]);
            if (rsp === 'cancel') {
                console.log("record cancelled");
                continue;
            }
            if (rsp === 'stop') {
                console.log("execution stopped");
                break;
            }
        }
        
        switch (type) {
            case 'pos':
                log.UpdateText(`Record: [${i + 1}/${record.length}]: moving to position`)
                await goTo(data, 25);
                break;
                
            case 'rot':
                log.UpdateText(`Record: [${i + 1}/${record.length}]: rotating`)
                await alignAngleTo(data);
                break;
                
            case 'use':
                log.UpdateText(`Record: [${i + 1}/${record.length}]: use`)
                console.log(`wait for ${data} ms`);
                await holdKeyAsync("F", data);
                break;
                
            case 'gather':
                log.UpdateText(`Record: [${i + 1}/${record.length}]: gathering`)
                // center camera
                await pressKeyAsync("Menu");
                
                // Dunno, sometimes game just doesn't register that gathering is started...
                for (let i = 0; i < 20; i++) {
                    await pressKeyAsync("F");
                    await pressMultipleKeysAsync();
                    await pressMultipleKeysAsync();
                }
                
                let holdPromise = holdKeyAsync("F", 1000);
                // at least second we will need
                await delay(1000);
                waitUntilPlayerIsControllable().then(interruptAllInput);
                await holdPromise;
                break;
                
            case 'wait':
                log.UpdateText(`Record: [${i + 1}/${record.length}]: waiting ${data} ms`)
                await delay(data);
                break;
        }
        
        if (after) {
            let rsp = await after(record[i]);
            if (rsp === 'stop') {
                console.log("execution stopped");
                break;
            }
        }
    }
    log.UpdateText(`Record: Done`);
    setTimeout(() => log.Remove(), 1000);
}