const WebSocketServer = require('ws').Server;

class NetworkManager {

    constructor(port) {
        this.wss = new WebSocketServer({port: port});
        this.wss.on('connection', onConnect);
    }

    onConnect = (ws) => {
        const connection = new Connection(ws);

        // set listener for receiving each client's messages
        ws.on('message', (message) => {
            var packet;

            // parse message
            try {
                packet = JSON.parse(message);
            } catch(e) {
                return;// jsut return if invalid json
            }
            
            // send packet to connection
            connection.onMessage(packet);
        });

        ws.on('close', () => {
            connection.remove();
        });
    }

}