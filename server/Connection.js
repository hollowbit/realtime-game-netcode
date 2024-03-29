const { PlayerManager } = require('./Player');
const WebSocket = require('ws');

class Connection {

    constructor(ws) {
        this.ws = ws;
        this.player = null;

        // ask client to connect
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
                    this.player.commandManager.giveCommands(packet.commands);
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
            'commandStartTime' in packet) {
            
            this.player = PlayerManager.createPlayer(this, packet.playerName, packet.commandStartTime);
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