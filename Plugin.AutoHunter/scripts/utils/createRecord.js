import {getCameraAngle, getImmediatePlayerPosition} from "./walking";


const POSITION_KEY = "NumPad0";
const ROTATION_KEY = "NumPad1";
const GATHER_KEY = "NumPad2";

export function createRecord(name) {
    updateStateName("Creating actions record");
    if (updateStickyLog("action_recording", "--")) {
        console.log("only one path generator can exist at one time!");
        return;
    }

    let log = createStickyLog("Action #", "action_recording");
    localStorage.removeItem(name);
    let points = [];

    function update() {
        log.UpdateText(`Action #${points.length} | Pos: ${POSITION_KEY}, Rot: ${ROTATION_KEY}, gather: ${GATHER_KEY}`);
        var lastItem = points[points.length - 1]?.[0];
        if (lastItem) {
            console.log(`Last item: ${lastItem}`);
        }
        localStorage.setItem(name, points);
    }
    update();

    registerHotkey(POSITION_KEY, () => {
        points.push(["pos", getImmediatePlayerPosition()]);
        update();
    });
    registerHotkey(ROTATION_KEY, () => {
        points.push(["rot", getCameraAngle()]);
        update();
    });
    registerHotkey(GATHER_KEY, () => {
        points.push(["gather"]);
        update();
    });
}