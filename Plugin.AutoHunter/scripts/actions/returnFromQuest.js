export async function a_returnFromQuest() {
    updateStateName("returning from Expedition");
    
    // open menu
    await pressKeyAsync("Escape");
    await delay(1200);

    // navigate to "Abandon"
    await pressKeyAsync("Right");
    await delay(200);
    await pressKeyAsync("Down");
    await pressKeyAsync("F");

    // waiting for modal
    await delay(600);

    // confirm exit
    await pressKeyAsync("F")

    // needed on "Return from Quest"
    // exiting menus
    // await delay(12000);
    // await pressKeyAsync("F");
    // await delay(600);
    // await pressKeyAsync("F");
    // await delay(600);
    // await pressKeyAsync("F");
    // await delay(600);
    // await pressKeyAsync("F");

    console.log("returnFromQuest done");
}