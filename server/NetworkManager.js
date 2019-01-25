const WebSocketServer = require('ws').Server;
const { Connection } = require('./Connection');

class NetworkManager {

    constructor(port) {
        this.wss = new WebSocketServer({port: port});
        this.wss.on('connection', this.onConnect);
        console.log("Network started on port: " + port);
    }

    onConnect(ws) {
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
            console.log("message: " + message)
            
            // send packet to connection
            connection.onMessage(packet);
        });

        ws.on('close', () => {
            connection.remove();
        });
    }

}

module.exports.NetworkManager = NetworkManager;