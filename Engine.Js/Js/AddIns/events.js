let connections = new Set();
let addInCtx = ctx.AddIns.Events;

globalThis.registerEvent = function registerEvent(keyOrEvent, cb, useSender = false) {
    let event = keyOrEvent;

    if (typeof keyOrEvent == "string") {
        const parts = keyOrEvent.split('.');
        const container = addInCtx.GetEventContainer(keyOrEvent);
        if (container) {
            const eventName = parts[parts.length - 1];
            event = container[eventName];
        }
    }

    if (event == null || !('connect' in event)) {
        throw new Error(`Cannot find event '${keyOrEvent}'`);
    }

    let connection = event.connect(function (sender, args) {
        if (!addInCtx.EnableRaisingEvents) return;

        try {
            if (useSender) {
                cb(sender, args);
            } else {
                cb(args);
            }
        } catch (e) {
            let eventName = typeof keyOrEvent == "string"
                ? `'${keyOrEvent}'`
                : `from '${sender.GetType().Name}'`
            console.log(`Error on handling event ${eventName}: ${e}`);
        }
    });
    connections.add(connection);
    
    return {
        connectionRef: new WeakRef(connection),
        unregister() {
            var con = this.connectionRef.deref();
            if (!con) return;

            con.disconnect();
            connections.delete(con);
        }
    }
};

ctx.OnReset.connect(() => {
    connections.forEach(c => c.disconnect());
    connections.clear();
});