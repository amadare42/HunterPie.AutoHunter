import {calcDistance, clonePlayerPos} from "./index";

// CONFIGURATION

// used to control rotation accuracy - if target angle is less than EXPECTED_ROTATION_PER_FRAME, rotation will not be performed
const EXPECTED_ROTATION_PER_FRAME = 6;

// since rotation uses acceleration, to increase accuracy, delay will be added before each rotation frame so acceleration will be reset
// delay will be activated if difference with current and target angle is less than ROTATION_DELAY_THRESHOLD
const ROTATION_DELAY_THRESHOLD = 35;

// character will run until distance to target will be less than this threshold
const RUN_THRESHOLD = 120;

// CONFIGURATION END

export function trackPlayerPosition() {
    let evt = registerEvent(Player.OnPlayerScanFinished, () => {
        let pos = clonePlayerPos();
        let angle = getCameraAngle();
        let str = `Position: (${pos.X.toFixed(0)}, ${pos.Y.toFixed(0)}, ${pos.Z.toFixed(0)}) ${angle.toFixed(1)}`;
        if (!updateStickyLog("player_pos", str)){
            evt.unregister();
        }
    })
    return createStickyLog("Position:", "player_pos");
}

export function trackGameTime() {
    let evt = registerEvent(Player.OnPlayerScanFinished, () => {
        let time = Game.WorldTime;
        let str = `Time: ${time}`;
        if (!updateStickyLog("play_time", str)){
            evt.unregister();
        }
    })
    return createStickyLog("Time:", "play_time");
}

/**
 * 
 * @param {sVector3Type} target
 * @param {string} name
 * @returns {StickyLog}
 */
export function trackTargetPosition(target, name = "Target") {
    const id = "target_" + name;
    let evt = registerEvent(Player.OnPlayerScanFinished, () => {
        let targetAngle = getAngleForTarget(target);
        let str = `${name}: (${target.X.toFixed(0)}, ${target.Y.toFixed(0)}, ${target.Z.toFixed(0)}) ${targetAngle.toFixed(1)}`;
        if (!updateStickyLog(id, str)){
            evt.unregister();
        }
    })
    return createStickyLog(name, id);
}

/**
 * Control character to move to specified position.
 * Theoretically, should be successful for any point that isn't behind some obstacle.
 * @param {sVector3Type} target target point 
 * @param {number} threshold radius around target point that is acceptable
 */
export async function goTo(target, threshold) {
    let cancellation = { cancel: false };
    let pressingLoop = new Promise(async (r) => {
        while (!cancellation.cancel) {
            const distance = calcDistance(target, getImmediatePlayerPosition());
            if (distance < threshold) {
                cancellation.cancel = true;
                console.log(`arrived to destination (${distance.toFixed(2)})`);
                break;
            }

            let rotation = getAngleForTarget(target) - getCameraAngle();
            let rotated = false;
            if (rotation > EXPECTED_ROTATION_PER_FRAME) {
                await pressKeyAsync('OEMPlus');
                rotated = true;
            } else if (rotation < -EXPECTED_ROTATION_PER_FRAME) {
                await pressKeyAsync('K');
                rotated = true;
            } else {
                if (distance > RUN_THRESHOLD) {
                    await pressMultipleKeysAsync('Shift', 'W');
                } else {
                    await pressKeyAsync('W');
                }
            }
            if (rotated && Math.abs(rotation) < ROTATION_DELAY_THRESHOLD) {
                await pressMultipleKeysAsync();
            }
        }
        r();
    });

    return pressingLoop;
}

/**
 * Rotate character to specified angle
 * @param {number} targetAngle 
 * @param {{cancel: boolean}} cancellation token for early cancel
 */
export async function alignAngleTo(targetAngle, cancellation = { cancel: false }) {

    let rotation = targetAngle - getCameraAngle();
    try {
        while (Math.abs(rotation) >= EXPECTED_ROTATION_PER_FRAME && !cancellation.cancel) {
            if (rotation > EXPECTED_ROTATION_PER_FRAME) {
                await pressKeyAsync('OEMPlus');
            } else if (rotation < -EXPECTED_ROTATION_PER_FRAME) {
                await pressKeyAsync('K');
            }
            if (Math.abs(rotation) < ROTATION_DELAY_THRESHOLD) {
                await pressMultipleKeysAsync();
            }
            rotation = targetAngle - getCameraAngle();
        }
    } catch (e) {
        console.log(e.toString())
    }
}

export function getCameraAngle() {
    var bytes = Memory.ReadBytes(EQUIPMENT_OFFSET, AngleOffsets, 12);
    const arr = new Float32Array(new Uint8Array(bytes).buffer);
    const [ x, z, y ] = arr;
    return (-(calcAngleDegrees(y, x) - 180));
}

/**
 * Get angle from character position to target point.
 * @param {sVector3Type} target
 * @returns {number}
 */
export function getAngleForTarget(target) {
    const pos = getImmediatePlayerPosition();
    let x = target.X - pos.X;
    let y = target.Y - pos.Y;
    return (-calcAngleDegrees(y, x)) + 180;
}

// Memory stuff
const EQUIPMENT_OFFSET = Address.GetAddress("EQUIPMENT_OFFSET");
const PlayerPositionOffsets = Address.GetOffsets("PlayerPositionOffsets");
const AngleOffsets = PlayerPositionOffsets.Clone();
AngleOffsets[2] = 0x4D0;

/**
 * Get current player position in memory. (Doesn't wait for HunterPie scan)
 * @returns {sVector3Type}
 */
export function getImmediatePlayerPosition() {
    var bytes = Memory.ReadBytes(EQUIPMENT_OFFSET, PlayerPositionOffsets, 12);
    const arr = new Float32Array(new Uint8Array(bytes).buffer);
    return {
        X: arr[0],
        Y: arr[2],
        Z: arr[1]
    }
}


// Math
export function calcAngleDegrees(x, y) {
    return Math.atan2(y, x) * 180 / Math.PI;
}