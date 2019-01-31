const { CommandManager } = require('./CommandManager');

const PLAYER_SIZE = 50;
const PLAYER_SPEED = 250;

const WORLD_WIDTH = 640;
const WORLD_HEIGHT = 480;

class PlayerManager {

    constructor() {
        this.players = new Map();
    }

    // create a new player and return it
    createPlayer(connection, name, commandStartTime) {
        const player = new Player(connection, name, commandStartTime);
        this.players.set(name, player);
        return player;
    }

    removePlayer (name) {
        this.players.delete(name);
    }

    generateSnapshots (callbackEach) {
        this.players.forEach(player => {
            callbackEach(player.name, player.generateSnapshot());
        });
    }

    forEach(callback) {
        this.players.forEach(callback);
    }

    update() {
        this.forEach((player) => {
            player.update();
        });
    }

}

class Player {

    constructor(connection, name, commandStartTime) {
        this.connection = connection;
        this.name = name;
        this.x = 50;
        this.y = 50;

        this.commandManager = new CommandManager((command, time, dt) => { this.runCommand(command, time, dt); } , () => { return this.generateSnapshot(); }, commandStartTime, connection);
    }

    // called 10/s
    update() {
        this.commandManager.update();
    }

    runCommand(command, time, dt) {
        if (command.up) {
            this.y -= PLAYER_SPEED * dt;
        }

        if (command.down) {
            this.y += PLAYER_SPEED * dt;
        }
        
        if (command.right) {
            this.x += PLAYER_SPEED * dt;
        }
        
        if (command.left) {
            this.x -= PLAYER_SPEED * dt;
        }

        //TODO using world snapshots, check with collisions on other players at this timestamp

        // check for collisions with world
        if (this.x + PLAYER_SIZE > WORLD_WIDTH) {
            this.x = WORLD_WIDTH - PLAYER_SIZE;
        }

        if (this.y + PLAYER_SIZE > WORLD_HEIGHT) {
            this.y = WORLD_HEIGHT - PLAYER_SIZE;
        }

        if (this.x < 0) {
            this.x = 0;
        }

        if (this.y < 0) {
            this.y = 0;
        }
    }

    generateSnapshot() {
        return {
            type: 'Player',
            x: this.x,
            y: this.y
        };
    }

}

module.exports = {
    PlayerManager: new PlayerManager(),
    Player
}