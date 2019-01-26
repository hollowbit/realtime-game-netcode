class NetworkManager {

    constructor(address, port) {
        this.ws = new WebSocket(`ws://${address}:${port}`, "protocolOne");
        this.ws.onopen((e) => { this.onOpen(e); });
        this.ws.onclose((e) => { this.onClose(e); });
        this.ws.onmessage((e) => { this.onMessage(e); });
    }

    onOpen(event) {

    }

    onClose(event) {

    }

    onMessage(event) {
        var packet;
        try {
            packet = JSON.parse(event.data);
        } catch (e) {
            return;// ignore invalid packets
        }

        //TODO handle packet
    }

    sendPacket(packet) {
        this.ws.send(JSON.stringify(packet));
    }
    
}

module.exports.NetworkManager = NetworkManager;