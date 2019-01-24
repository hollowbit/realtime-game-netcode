const WebSocketServer = require('ws').Server;

class NetworkManager {

    constructor(port) {
        this.wss = new WebSocketServer({port: port});
        this.wss.on('connection', onConnect);
    }

    onConnect = (ws) => {
        // set listener for receiving each client's messages
        ws.on('message', (message) => {
            onMessage(ws, message);
        })

        ws.on('close', ())
    }

    onMessage = (ws, message) => {
        var packet = null;
        try {
            JSON.parse(message);
        } catch (ex) {/* Ignore if cannot parse */}

        switch(packet.type) {
            case "command":
                
                break;
        }
    }

}