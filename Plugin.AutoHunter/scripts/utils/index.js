import {InputStates, readInputState} from "./inputStates";

export const clr = host.lib('PresentationFramework', 'System.Windows');

/**
* @param {sVector3Type} v1 
* @param {sVector3Type} v2
*/
export function calcDistance(v1, v2) {
    var a = v1.X - v2.X;
    var b = v1.Y - v2.Y;

    var c = Math.sqrt( a*a + b*b );
    return c;
}
/**
 * If crown data is missing in resources, HunterPie will throw exception. Here is safe wrapper.
 * @param {MonsterType} monster
 */
export function safeGetCrown(monster) {
    try {
        return monster.Crown;
    } catch (e) {
        console.error(`Cannot find crown for monster with id ${monster.GameId} ${monster.Name} ${monster.Id} ${e}`);
        return "UNKNOWN";
    }
}

//** Hacky way to find in memory if quest book is currently opened. */
export function isBookOpened() {
    // have no idea what this is. If add 0x274 offset, will point to index in menu.
    // Will be 7 if book is opened but not on quests
    return (Memory.ReadEntryInt("QUESTBOOK_OPENED_MAGIC_NUMBER") == 7);
}

/** 
 * Sets in-game mouse positions without changing actual system cursor position. NOTE:
 *  - since your actual mouse remain unchanged, minor mouse movement on focused game, will reset mouse position back
 *  - this function only sets mouse position and doesn't trigger selection update. Therefore items could be selected only if position was set beforehand
*/
export function setMousePosition(x, y) {
    const mousePositionBuffer = new Int32Array(2);
    mousePositionBuffer[0] = x;
    mousePositionBuffer[1] = y;
    const bytes = toByteArray(mousePositionBuffer);
    
    Memory.WriteEntryBytes("MOUSE_STRUCT", bytes);
    Memory.WriteEntryBytes("MOUSE_STRUCT_2", bytes);
}

export function msgBox(message, title = "Automated message") {
    const MessageBoxButton = clr.System.Windows.MessageBoxButton;
    clr.System.Windows.MessageBox.Show(message, title, MessageBoxButton.OK);
}

export function clonePlayerPos() {
    const pos = Player.Position;
    // TODO: HunterPie reports player position incorrectly, replace Z & Y when fixed
    return {
        X: pos.X,
        Y: pos.Z,
        Z: pos.Y
    }
}

/**
 * Returns promise that will be resolved when passed predicate is successful.
 * @param {function (sVector3Type): boolean} check
 * @returns {Promise<void>}
 */
export function waitForPlayerPosition(check) {
    return new Promise((rs, rj) => {
        const evt = registerEvent("Player.OnPlayerScanFinished", () => {
            try {
                if (check(clonePlayerPos())) {
                    evt.unregister();
                    rs();
                }
            } catch (e) {
                evt.unregister();
                rj(e);
            }
        });
    });
}

export async function waitForQuestToEnd() {
    updateStateName("waiting for end-quest screen");
    let token = { cancelled: false }
    setTimeout(() => token.cancelled = true, 70000);

    console.log("waiting for end quest transition");
    await waitForInputState(InputStates.Transition, token);
    console.log("waiting for controllable end-quest screen");
    await waitForInputState(InputStates.Controllable, token);
    await delay(2100);
}

export async function waitUntilPlayerIsControllable() {
    console.log("Waiting for player to be controllable")
    return new Promise((rs) => {
        let id = setInterval(() => {
            if (readInputState() === InputStates.Controllable) {
                clearInterval(id);
                rs();
            }
        }, 500);
    });      
}

export async function waitForInputState(state, cancelToken = { cancelled: false }) {
    console.log(`Waiting for ${InputStates[state]} state`);
    let log = createStickyLog("State:", "state_wait");
    return new Promise((rs, rj) => {
        let id = setInterval(() => {
            log.UpdateText("State: " + InputStates[state]);
            if (readInputState() === state) {
                log.Remove();
                clearInterval(id);
                rs();
            }
            if (cancelToken.cancelled) {
                log.Remove();
                clearInterval(id);
                rj(new Error("Waiting for input state was cancelled"));
            }
        }, 500);
    });
}

export function trackZone() {
    function getLocation() { return 'Zone: ' + Player.ZoneName }
    let log = createStickyLog(getLocation(), "zone_tracker");
    registerEvent(Player.OnZoneChange, () => log.UpdateText(getLocation()))
}