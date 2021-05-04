/*
    Naming convention:
        a_: simple atomic actions (like "go to quest", or "wait for book animation")
        c_: complex actions that combines multiple simpler actions (like "get quest from quest giver")
*/

import { Positions } from '../utils/positions';
import { isBookOpened, setMousePosition } from "../utils";
import {alignAngleTo, goTo} from "../utils/walking";

// ---- CONFIGURATION ---

export const DELAY_MENU_QUICK = 200;
export const DELAY_MENU_LONG = 700;
export const DELAY_BOOK_ANIMATION = 470;
export const DELAY_DIALOG = 900;
export const DELAY_DEPART = 9001;

export const CONFIG = {
    selectCampKeys: []
}

let SELECT_QUEST = () => selectQuestCategory('m', 'inv', [], []);

// ---- CONFIGURATION ---

/**
 * Helper function to specify quest with button sequence
 * @param {'m' | 'h'} rank
 * @param {'opt' | 'inv' | 'evt'} kind
 * @param {KnownKeys[]} movs1 movements that will select quest for investigation and level for optionals
 * @param {KnownKeys[]} movs2 movements that will select quest for optionals. Isn't used for investigations
 */
export function setSelectedQuest(rank, kind, movs1, movs2) {
    SELECT_QUEST = () => selectQuestCategory(rank, kind, movs1, movs2);
}


// Seliana Gathering Hub Spawn: go to giver, open dialog, get quest, depart
export async function c_getQuestAndDepart() {
    await a_goToQuestGiver();
    await a_questGiverDialog();
    await c_getQuest();
    await a_depart();
}

// Quest giver dialog: normalize selection in book, post selected quest
export async function c_getQuest() {
    updateStateName("getting quest");

    await a_openBook();
    await a_closeBook();

    await a_openBook();
    await delay(250);
    await a_selectQuest();
}

// Opened quest book on first page: select quest and post
export async function a_selectQuest() {

    // select quest 
    updateStateName("selecting quest");
    await SELECT_QUEST();
    console.log('confirm multiplayer');

    // confirm multiplayer
    await delay(DELAY_MENU_LONG);
    await pressKeyAsync("F")

    // select camp
    await delay(DELAY_MENU_LONG);
    for (const k of CONFIG.selectCampKeys) {
        await pressKeyAsync(k);
        // wait for single frame
        await pressMultipleKeysAsync();
    }
    await pressKeyAsync("F")

    // confirm post
    await delay(1300);
    await pressKeyAsync("F")  
}



// hold 'W' until we get to quest giver
export async function a_goToQuestGiver() {
    updateStateName("going to quest giver");
    
    await goTo(Positions.Seliana.QuestGiver, 20)
    await alignAngleTo(285);
    await delay(700);
}

// facing quest giver: skip talking with quest giver to go to Quest Counter screen
export async function a_questGiverDialog() {
    updateStateName("skipping dialog");
    
    await pressKeyAsync('F');
    await delay(1000);
    // await setMousePosition(0, 0);

    // skip dialog 1
    await pressKeyAsync("Escape");
    await delay(DELAY_DIALOG);

    // skip dialog 2
    await pressKeyAsync("Escape");
    await delay(DELAY_DIALOG);

    // Quest Counter is now open
}

// Quest Counter with "Post new quest" selected
export async function a_openBook() {
    // open book
    await pressKeyAsync("F");

    // wait for book animation
    await holdKeyAsync("Shift", 85);
    console.log("book anim done");
}

// Quest book opened on any page: back until book is closed
export async function a_closeBook() {
    updateStateName("normalizing book selection");
    
    // exit dialog to normalize selected page
    await pressKeyAsync("Escape"); // exit quests list
    while (isBookOpened()) {
        await delay(DELAY_MENU_QUICK);
        await pressKeyAsync("Escape");
        await delay(DELAY_MENU_QUICK);
    }

    await delay(DELAY_BOOK_ANIMATION);
}

// Quest posted: wait for depart to be available, depart
export async function a_depart() {
    updateStateName("departing");
    
    // wait until quest is ready.
    // this can be very quick, but sometimes it is 5+ seconds
    await delay(DELAY_DEPART);

    // open party menu
    await pressKeyAsync("Space");
    await delay(DELAY_MENU_LONG);

    // press depart button
    await pressKeyAsync("Down")
    await pressKeyAsync("F")

    // confirm depart
    await delay(DELAY_MENU_LONG)
    await pressKeyAsync("F")
}

/**
 * @typedef {'m' | 'h'} QuestRank
 * @typedef {'opt' | 'inv' | 'evt'} QuestKind
 * @typedef {KnownKeys[]} Movements
 * @typedef {[QuestRank, 'opt', Movements, Movements]} QuestSelection
 * 
 * @typedef {Object} QuestSelectionObj
 * @property {QuestRank} rank quest rank
 * @property {QuestKind} kind quest kind
 * @property {Movements} movs1 movements that will select quest for investigation and level for optionals
 * @property {Movements} movs2 movements that will select quest for optionals. Isn't used for investigations
 */


/**
 * Helper function to specify quest with button sequence
 * @param {'m' | 'h'} rank
 * @param {'opt' | 'inv' | 'evt'} kind
 * @param {KnownKeys[]} movs1 movements that will select quest for investigation and level for optionals
 * @param {KnownKeys[]} movs2 movements that will select quest for optionals. Isn't used for investigations
 */
export async function selectQuestCategory(rank, kind, movs1, movs2 = []) {
    // -- should be on "Select Rank" screen with Master Rank highlighted --

    // select rank
    if (rank == 'h') {
        await pressKeyAsync("Down");  // hight/low
        await pressMultipleKeysAsync();
    }
    await pressKeyAsync("F");         // master
    await delay(400);

    // -- should be on quest kind list for selected rank --
    await pressKeyAsync("Down");      // optional quests
    await delay(150);
    if (kind == 'inv') {
        await pressKeyAsync("Down");  // investigations
        await pressMultipleKeysAsync();
    } else if (kind == 'evt') {
        await pressKeyAsync("Down");
        await pressMultipleKeysAsync();
        await pressKeyAsync("Down");
        await pressMultipleKeysAsync();
    }
    await pressKeyAsync("F");
    await delay(DELAY_MENU_LONG);

    if (kind == 'opt') {
        await delay(DELAY_MENU_QUICK);

        // selecting *
        for (let mov of movs1) {
            await pressKeyAsync(mov);
            await pressMultipleKeysAsync();
        }
        await pressKeyAsync("F");
        await delay(300);

        // wait for book animation
        await delay(DELAY_BOOK_ANIMATION);

        // selecting quest
        for (let mov of movs2) {
            await pressKeyAsync(mov);
            await pressMultipleKeysAsync();
        }
    } else {
        // wait for book animation
        await delay(DELAY_BOOK_ANIMATION);

        // selecting quest
        for (let mov of movs1) {
            await pressKeyAsync(mov);
            await pressMultipleKeysAsync();
        }
    }
    await pressKeyAsync("F");
    // quest should be selected now
}