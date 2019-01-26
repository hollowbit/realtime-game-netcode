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
    createPlayer(connection, name, commandRate, commandStartTime) {
        const player = new Player(connection, name, commandRate, commandStartTime);
        this.players.set(name, player);
        return player;
    }

    removePlayer (name) {
        this.players.get(name).remove();
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

}

class Player {

    constructor(connection, name, commandRate, commandStartTime) {
        this.connection = connection;
        this.name = name;
        this.x = 50;
        this.y = 50;
        this.dt = 1 / commandRate;

        this.commandManager = new CommandManager((command) => { this.runCommand(command); } , () => { return this.generateSnapshot(); }, commandRate, commandStartTime, connection);
    }

    runCommand(command) {
        if (command.up) {
            this.y -= PLAYER_SPEED * this.dt;
        }

        if (command.down) {
            this.y += PLAYER_SPEED * this.dt;
        }
        
        if (command.right) {
            this.x += PLAYER_SPEED * this.dt;
        }
        
        if (command.left) {
            this.x -= PLAYER_SPEED * this.dt;
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

    remove() {
        this.commandManager.remove();
    }

}

module.exports = {
    PlayerManager: new PlayerManager(),
    Player
}