class Connection {

    constructor(ws) {
        this.ws = ws;
        this.player = null;
    }

    /**
     * When a packet is received
     * @param {Object} packet Packet object from client 
     */
    onMessage(packet) {
        switch(packet.type) {
            case 'connect':
                _connect(packet);
                break;
            case 'command':
                break;
        }
    }

    /**
     * Check if there is a player associated to this connection
     */ 
    hasPlayer = () => {
        return this.player != null;
    }

    /**
     * Handle when a player connects
     * @param {Object} packet Data for connection
     */
    _connect = (packet) => {
        // ensure that required data is available
        if ('playerName' in packet &&
            'commandRate' in packet) {
            
            this.player = PlayerManager.createPlayer(packet.playerName, packet.commandRate);
        }
    }

}