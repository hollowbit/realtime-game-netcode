const { PlayerManager } = require('./Player');

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
            type: 'snapshot',
            time: + new Date(),
            snapshots
        }

        PlayerManager.forEach((player) => {
            player.connection.sendPacket(packet);
        });
    }

}

module.exports.World = World;