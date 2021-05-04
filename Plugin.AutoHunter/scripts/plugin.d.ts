/// <reference path=".\\hunterpie.d.ts"/>

/*
    here are types that are specific to plugin itself
*/

//** Adds handler to known event */
declare function registerEvent<T extends keyof Events>(evt: T, handler: (args: Events[T]) => void): EventRegistration;
declare function registerEvent<T extends keyof Events>(evt: T, handler: (sender: any, args: Events[T]) => void, useSender: true): EventRegistration;
declare function registerEvent<T>(evt: EventObj<T>, handler: (args: T) => void): EventRegistration;
declare function registerEvent<T>(evt: EventObj<T>, handler: (sender: any, args: T) => void, useSender: true): EventRegistration;

declare type HotkeyRegistration = { unregister(): void };
declare function registerHotkey(hotkey: string, handler: () => void): HotkeyRegistration;

//** Sends key using default method */
// declare function pressKey(key: KnownKeys): void;
declare function pressKeyAsync(key: KnownKeys): Promise<void>;

declare function pressMultipleKeysAsync(...key: KnownKeys[]): Promise<void>;

// declare function holdKey(key: KnownKeys, frames: number): void;
declare function holdKeyAsync(key: KnownKeys, frames: number): Promise<void>;

declare function interruptAllInput(): Promise<void>;
declare function interruptLastInput(): Promise<void>;
declare function interruptInput(inputId: number): Promise<void>;
declare function getLastInputId(): number;

//** Captures screenshot of current screen with text on added on top */
declare function createScreenshot(name: string): Promise<void>;

//** Update current state name for widget to display */
declare function updateStateName(state?: string): void;

declare function delay(ms: number): Promise<void>;
declare function delay(ms: number, silent: boolean): Promise<void>;
declare function delay(ms: number, opts: { silent?: boolean, constant?: boolean }): Promise<void>;

declare function wait(ms: number): Promise<void>;
declare function wait(ms: number, silent: boolean): Promise<void>;

interface StickyLog {
    UpdateText(text: string): void;
    Remove();
}
//** Adds log that on top of everything and doesn't get removed until requested (or on reload) */
declare function createStickyLog(text: string, id: string = null, removeOnStateChange: boolean = false): StickyLog;
//** Update existing sticky log by id. Returns false if missing. */
declare function updateStickyLog(id: string, text: string): boolean;

declare const Memory: {
    ReadEntryInt(entryName: string): number;
    ReadInt(address: number): number;
    ReadMultilevelInt(address: number, offsets: ClrArray<number>): number;
    
    WriteEntryBytes(entryName: string, data: ClrArray<number>): boolean;
    WriteBytes(address: number, offsets: ClrArray<number>, data: ClrArray<number>): boolean;
}

declare function toByteArray(buffer: ArrayBufferView): ClrArray<number>;


type KnownKeys = "None" | "LeftButton" | "RightButton" | "Cancel" | "MiddleButton" | "ExtraButton1" | "ExtraButton2" | "Back" | "Tab" | "Clear" | "Return" | "Shift" | "Control" | "Menu" | "Pause" | "CapsLock" | "Kana" | "Hangeul" | "Hangul" | "Junja" | "Final" | "Hanja" | "Kanji" | "Escape" | "Convert" | "NonConvert" | "Accept" | "ModeChange" | "Space" | "Prior" | "Next" | "End" | "Home" | "Left" | "Up" | "Right" | "Down" | "Select" | "Print" | "Execute" | "Snapshot" | "Insert" | "Delete" | "Help" | "N0" | "N1" | "N2" | "N3" | "N4" | "N5" | "N6" | "N7" | "N8" | "N9" | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "LeftWindows" | "RightWindows" | "Application" | "Sleep" | "Numpad0" | "Numpad1" | "Numpad2" | "Numpad3" | "Numpad4" | "Numpad5" | "Numpad6" | "Numpad7" | "Numpad8" | "Numpad9" | "Multiply" | "Add" | "Separator" | "Subtract" | "Decimal" | "Divide" | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12" | "F13" | "F14" | "F15" | "F16" | "F17" | "F18" | "F19" | "F20" | "F21" | "F22" | "F23" | "F24" | "NumLock" | "ScrollLock" | "NEC_Equal" | "Fujitsu_Jisho" | "Fujitsu_Masshou" | "Fujitsu_Touroku" | "Fujitsu_Loya" | "Fujitsu_Roya" | "LeftShift" | "RightShift" | "LeftControl" | "RightControl" | "LeftMenu" | "RightMenu" | "BrowserBack" | "BrowserForward" | "BrowserRefresh" | "BrowserStop" | "BrowserSearch" | "BrowserFavorites" | "BrowserHome" | "VolumeMute" | "VolumeDown" | "VolumeUp" | "MediaNextTrack" | "MediaPrevTrack" | "MediaStop" | "MediaPlayPause" | "LaunchMail" | "LaunchMediaSelect" | "LaunchApplication1" | "LaunchApplication2" | "OEM1" | "OEMPlus" | "OEMComma" | "OEMMinus" | "OEMPeriod" | "OEM2" | "OEM3" | "OEM4" | "OEM5" | "OEM6" | "OEM7" | "OEM8" | "OEMAX" | "OEM102" | "ICOHelp" | "ICO00" | "ProcessKey" | "ICOClear" | "Packet" | "OEMReset" | "OEMJump" | "OEMPA1" | "OEMPA2" | "OEMPA3" | "OEMWSCtrl" | "OEMCUSel" | "OEMATTN" | "OEMFinish" | "OEMCopy" | "OEMAuto" | "OEMENLW" | "OEMBackTab" | "ATTN" | "CRSel" | "EXSel" | "EREOF" | "Play" | "Zoom" | "Noname" | "PA1" | "OEMClear";
