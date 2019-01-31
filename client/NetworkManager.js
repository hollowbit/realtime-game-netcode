import Client from "./client.js";

const SIMULATED_LAG = 2000;

class NetworkManager {

    constructor(address, port) {
        this.ws = new WebSocket(`ws://${address}:${port}`, "protocolOne");
        this.ws.onopen = (e) => { this.onOpen(e); };
        this.ws.onclose = (e) => { this.onClose(e); };
        this.ws.onmessage = (e) => { this.onMessage(e); };
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
        
        this._handlePacket(packet);
    }

    _handlePacket(packet) {
        // handle packets based on type
        switch(packet.type) {
            case 'commandresponse':
                Client.world.player.commandManager.onCommandResponse(packet.response);
                break;
            case 'snapshot':
                Client.world.giveSnapshot(packet);
                break;
            case 'pleaseconnect':
                // create a connection
                this.sendPacket(Client.world.player.connect());
                break;
        }
    }

    sendPacket(packet) {
        this.ws.send(JSON.stringify(packet));
    }
    
}

export default NetworkManager;