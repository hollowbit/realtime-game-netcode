const PLAYER_SIZE = 50;
const PLAYER_SPEED = 50;

class PlayerManager {

    constructor() {
        this.players = new Map();
    }

    // create a new player and return it
    createPlayer(connection, name, commandRate) {
        const player = new Player(connection, name, commandRate);
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

    constructor(connection, name, commandRate) {
        this.connection = connection;
        this.name = name;
        this.x = 50;
        this.y = 50;
        this.commandRate = commandRate;
        this.commands = [];
        this.dt = 1 / commandRate;

        // set update loop to apply commands
        this.updateThread = setInterval(() => { this.update(); }, 1000 / commandRate);
    }

    update() {
        // don't bother if there are no commands
        if (this.commands.length == 0) {
            return;
        }

        // get next command and apply it
        const command = this.commands[0];
        this.commands.splice(0, 1); // remove next commands

        if (command.up) {
            this.y += PLAYER_SPEED * this.dt;
        }

        if (command.down) {
            this.y -= PLAYER_SPEED * this.dt;
        }
        
        if (command.right) {
            this.x += PLAYER_SPEED * this.dt;
        }
        
        if (command.left) {
            this.x -= PLAYER_SPEED * this.dt;
        }

        //TODO using world snapshots, check with collisions on other players at this timestamp

        // check for collisions with world
        if (this.x + PLAYER_SIZE >= WORLD_WIDTH) {
            this.x = WORLD_WIDTH - PLAYER_SIZE - 1;
        }

        if (this.y + PLAYER_SIZE >= WORLD_HEIGHT) {
            this.y = WORLD_HEIGHT - PLAYER_SIZE - 1;
        }

        if (this.x < 0) {
            this.x = 0;
        }

        if (this.y < 0) {
            this.y = 0;
        }
    }

    applyCommand(command) {
        this,commands.push(command);
    }

    generateSnapshot() {
        return {
            x: this.x,
            y: this.y
        };
    }

    remove() {
        clearInterval(this.updateThread);
    }

}

module.exports = {
    PlayerManager: new PlayerManager(),
    Player
}