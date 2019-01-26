const { PlayerManager } = require('./Player');

const WORLD_WIDTH = 640;
const WORLD_HEIGHT = 480;
const SIMULATION_RATE = 20;

class World {

    constructor() {
        setInterval(() => { this.update(); }, 1000 / SIMULATION_RATE);
    }

    update() {
        // If we had entities, we would update them here

        // Create world snapshot and send it to all players
        var snapshots = {};
        PlayerManager.generateSnapshots((playerName, snapshot) => {
            snapshots[playerName] = snapshot;
        });

        const packet = {
            timestamp: + new Date(),
            snapshots
        }

        PlayerManager.forEach((player) => {
            player.connection.sendPacket(packet);
        });
        console.log('Created Packet: ' + JSON.stringify(packet));
    }

}

module.exports.World = World;