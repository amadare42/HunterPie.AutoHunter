/*

Go through loop:
    - go to quest giver in Seliana Gathering Hub
    - select quest
    - check if monsters have configured crowns
    - if there are no crowns, return from quest
    - repeat

 */

import {msgBox, safeGetCrown, waitUntilPlayerIsControllable} from '../utils';
import * as actions from '../actions'
import {setSelectedQuest} from "../actions";

// ---- CONFIGURATION ----

export const GOLD = "CROWN_GOLD";
export const MINI = "CROWN_MINI";

const Wanted = {
    "Blackveil Vaal Hazak": [GOLD],
    "Ruiner Nergigante": [GOLD],
    "Yian Garuga": [GOLD],
    "Scarred Yian Garuga": [MINI],
    "Gold Rathian": [MINI, GOLD]
}

setSelectedQuest('m', 'inv', [], []);

const SHOW_MESSAGE_BOX = false;


// ---- CONFIGURATION ----



// There is no event in HunterPie that fires when all monsters and their crowns are resolved.
// This class provides callback for that.
export const MonstersCreatedListener = new class {
    #inited = false;
    #cbs = [];
    #waitingForMonsters = false;
    #timeoutId = null;

    onMonstersCreated(cb) {
        this.#cbs.push(cb);
        if (!this.#inited) this._init();
    }

    _init() {
        registerEvent(Game.Player.OnPeaceZoneLeave, () => this.#waitingForMonsters = true);

        for (let i = 0; i < Game.Monsters.Length; i++) {
            registerEvent(Game.Monsters[i].OnCrownChange, this._onEvt);
            registerEvent(Game.Monsters[i].OnMonsterSpawn, this._onEvt);
        }

        this.#inited = true;
    }

    _onEvt = () => {
        // wait 500 ms after last CrownChange or MonsterSpawn from all monsters to make sure they are loaded
        if (this.#timeoutId) clearTimeout(this.#timeoutId);
        this.#timeoutId = setTimeout(this._trigger, 500);
    }

    _trigger = () => {
        // trigger only if wasn't triggered this expedition
        this.#waitingForMonsters = false;
        this.#cbs.forEach(cb => cb());
    }
}

export function startCrownGrinding() {
    if (updateStickyLog('crown_grind', 'Crown grinding: ON')) {
        console.log('Crown grinding already enabled!');
        return;
    }
    createStickyLog("Crown grinding: ON", "crown_grind");
    
    MonstersCreatedListener.onMonstersCreated(async () => {
        updateStateName("Waiting for area to load");
        await waitUntilPlayerIsControllable();
        console.log("Considering area loaded");
    
        if (await crownAsk()) {
            await actions.a_returnFromQuest();
        }
    });
    
    registerEvent("Player.OnPeaceZoneEnter", cg_OnPeaceZoneEnter);
    cg_OnPeaceZoneEnter(true);
}

export async function cg_OnPeaceZoneEnter(skipWait = false) {
    // only Seliana Gathering Hub
    if (Player.ZoneID != 306)
        return;

    updateStateName("Waiting for peaceful zone");
    await waitUntilPlayerIsControllable();

    updateStateName();
    await actions.c_getQuestAndDepart();
}

/*
* @param {MonsterType} monster
*/
export function isWanted(monster) {
    let crown = safeGetCrown(monster);
    if (crown == GOLD || crown == MINI) {
        console.log(monster.Name, crown)
    }
    
    return monster.IsAlive &&
        Wanted[monster.Name]?.includes(crown);
}


/**
 * 
 * @returns true if return is expected
 */
export async function crownAsk() {

    let wanted = Array.from(Game.Monsters).filter(m => m.IsActuallyAlive).filter(isWanted);
    if (wanted.length) {
        updateStateName("Session kept");
        console.log("session kept");
        if (SHOW_MESSAGE_BOX) {
            msgBox("One or more expected crowns found: " + wanted.map(m => `${m.Name} ${m.Crown}`).join(',\n'));
        }
        return false;
    } else {
        updateStateName("skipping automatically...");
        console.log("skipping automatically...");
        return true;
    }
}