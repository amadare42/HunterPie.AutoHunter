import {getCameraAngle, getImmediatePlayerPosition, trackPlayerPosition} from "./utils/walking";
import {startCrownGrinding} from "./routines/crownGrind";
import {startFrostbyteGrinding} from "./routines/floraFrostbite";

trackPlayerPosition();
//
// registerHotkey("Ctrl+P", () => {
//     localStorage.setItem("current", {
//         pos: getImmediatePlayerPosition(),
//         angle: getCameraAngle()
//     })
// })

registerHotkey("Ctrl+F7", async () => {
    await startFrostbyteGrinding()
});
registerHotkey("Ctrl+F6", async () => {
    startCrownGrinding();
});