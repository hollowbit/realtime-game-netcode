const { PlayerManager } = require('./Player');
const WebSocket = require('ws');

class Connection {

    constructor(ws) {
        this.ws = ws;
        this.player = null;

        // ask client to connect
        this.connectRequestTime = + new Date();
        this.sendPacket({type: 'pleaseconnect'});
    }

    /**
     * When a packet is received
     * @param {Object} packet Packet object from client 
     */
    onMessage(packet) {
        switch(packet.type) {
            case 'connect':
                this._connect(packet);
                break;
            case 'command':
                if (this.hasPlayer()) {
                    this.player.commandManager.giveCommand(packet.command);
                }
                break;
        }
    }

    /**
     * Check if there is a player associated to this connection
     */ 
    hasPlayer() {
        return this.player != null;
    }

    /**
     * Handle when a player connects
     * @param {Object} packet Data for connection
     */
    _connect(packet) {
        // ensure that required data is available
        if ('playerName' in packet &&
            'commandRate' in packet) {
            
            // determine when the client sent the connection request
            const ping = ((+ new Date()) - this.connectRequestTime);
            const commandStartTime = ping / 2 + this.connectRequestTime;
            
            this.player = PlayerManager.createPlayer(this, packet.playerName, packet.commandRate, commandStartTime);
            console.log("Player connected: " + this.player.name);
        }
    }

    remove() {
        if (this.hasPlayer()) {
            PlayerManager.removePlayer(this.player.name);
            console.log("Player disconnected: " + this.player.name);
        }
    }

    sendPacket(packet) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(packet));
        }
    }

}

module.exports.Connection = Connection;