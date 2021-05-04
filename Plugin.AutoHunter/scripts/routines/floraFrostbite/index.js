import { CONFIG, DELAY_MENU_LONG, setSelectedQuest } from "../../actions";
import {
    calcDistance,
    clonePlayerPos, trackZone,
    waitForQuestToEnd,
    waitUntilPlayerIsControllable
} from "../../utils";
import { MonstersCreatedListener } from "../crownGrind";
import {executeRecord} from "../../utils/executeRecord";
import * as actions from "../../actions";
import {RECORDED_ACTIONS} from "./path";

const Camp15Pos = {
    "X": 14883.0400390625,
    "Y": -22437.369140625,
    "Z": 2716.78515625
};

export function trackQuestTarget() {
    let id = setInterval(() => {
        let target = Memory.ReadEntryInt("QUEST_TARGET");
        let str = `Quest target: ${target}`;
        if (!updateStickyLog("quest_target", str)){
            clearInterval(id);
        }
    }, 500);
    return createStickyLog("Quest target:", "quest_target");
}

export async function runQuestSequence() {
    updateStateName("Executing quest sequence");

    // if spawned in unexpected location, abandoning quest, since we don't have a way to fast-travel yet
    if (calcDistance(clonePlayerPos(), Camp15Pos) > 1000) {
        console.log("Wrong location, returning");
        updateStateName("Wrong location, returning");
        await actions.a_returnFromQuest();
        return;
    }

    // execute recorded actions for gathering
    await executeRecord(RECORDED_ACTIONS, {
        after() {
            // after each action, check if we're already done. If so, stopping execution
            const plantsFound = Memory.ReadEntryInt("QUEST_TARGET");
            console.log(`Plants found: ${plantsFound}`);
            if (plantsFound === 10) {
                return "stop";
            }
        }
    });
    
    // wait for 
    try {
        await waitForQuestToEnd();
    } catch (e) {
        // if we didn't find enough plants, returning by timeout
        console.log('something went wrong, returning');
        await actions.a_returnFromQuest();
        return;
    }
    await endingQuest();
}

export async function startFrostbyteGrinding() {
    setSelectedQuest("m", "evt", ["Down", "Down", "Down", "Down"], []);
    CONFIG.selectCampKeys = ["Down", "Down", "Down"];

    if (updateStickyLog('frostbyte_grind', 'Frostbyte grinding: ON')) {
        console.log('Frostbyte grinding already enabled!');
        return;
    }
    
    trackQuestTarget();
    trackZone();
    
    createStickyLog("Frostbyte grinding: ON", "frostbyte_grind");
    let currentAction = Promise.resolve();

    // when character enters Seliana Gathering Hub, start getting quest
    MonstersCreatedListener.onMonstersCreated(async () => {
        updateStateName("Waiting for area to load");
        await waitUntilPlayerIsControllable();
        
        currentAction = runQuestSequence();
        await currentAction;
    });

    // when character enters Seliana Gathering Hub, start getting quest
    registerEvent("Player.OnPeaceZoneEnter", async () => {
        console.log('peaceful zone enter')
        if (Player.ZoneName !== "Seliana Gathering Hub") {
            console.log("Selinana is expected!");
            return;
        }
        await currentAction;
        await waitUntilPlayerIsControllable();
        await actions.c_getQuestAndDepart();
        updateStateName();
    });

    // if character is in gathering hub already, start grinding
    if (Player.ZoneName === "Seliana Gathering Hub") {
        await actions.c_getQuestAndDepart();
    }
}

export async function endingQuest() {
    updateStateName("returning from quest");
    await pressKeyAsync('W');
    await pressKeyAsync("F");
    await delay(DELAY_MENU_LONG);

    // take all
    await pressKeyAsync('A');
    await pressKeyAsync("F");
    await delay(DELAY_MENU_LONG);

    // appraise
    await pressKeyAsync("F");
    await delay(DELAY_MENU_LONG);
    await pressKeyAsync('W');
    await pressKeyAsync("F");
    await delay(DELAY_MENU_LONG);

    // take all
    await pressKeyAsync('A');
    await pressKeyAsync("F");
    await delay(DELAY_MENU_LONG);

    updateStateName("ending this...");
    
    let done = false;
    let zoneChangePromise = new Promise(r => {
        let evt = registerEvent(Player.OnZoneChange, () => {
            if (!done) {
                console.log("ended by zone change");
            }
            evt.unregister();
            r();
        })
    });
    let delayPromise = delay(25000, { silent: true, constant: true }).then(() => {
        if (!done) {
            console.log("ended by timeout");
        }
    });
    Promise.race([zoneChangePromise, delayPromise])
        .then(() => done = true);
    
    while (!done) {
        await pressKeyAsync("F");
        await delay(200);
    }
    updateStateName();
} 
