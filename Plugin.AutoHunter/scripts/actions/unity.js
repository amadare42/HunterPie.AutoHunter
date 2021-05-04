export async function c_unity() {
    for (let i = 0; i < 10; i++) {
        await a_unity();
    }
}

export async function a_unity() {
    // use for item
    await pressKeyAsync('E');
    await delay(3500);

    // open dialog
    await pressKeyAsync('F');
    await delay(800);

    // skip dialog 1
    await pressKeyAsync("Escape");
    await delay(700);
   
    // claim rewards
    await pressKeyAsync('F')
    await delay(2300);

    for (let i = 0; i < 10; i++) {
        await pressKeyAsync('F')
        await delay(250);
    }

    // close
    await pressKeyAsync('F')
    await delay(2700);
}