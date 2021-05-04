/// <reference path="..\\plugin.d.ts"/>

export enum InputStates {
    Controllable = 0,
    Interacting = 16,
    Transition = 2,
    Menu = 255
}

export function readInputState() {
    return Memory.ReadEntryInt("INPUT_STATE") as InputStates;
}
