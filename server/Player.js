class PlayerManager {

    constructor() {
        this.players = new Map();
    }

    // create a new player and return it
    createPlayer = (name) => {
        const player = new Player(command.player);
        this.players.set(command.player, player);
        return player;
    }

    removePlayer = (name) => {
        this.players.get(name)._remove();
        this.players.delete(name);
    }

    generatePackets = (callbackEach) => {
        this.players.forEach(player => {
            callbackEach(player.name, player.generatePacket());
        });
    }

}

class Player {

    constructor(name, commandRate) {
        this.name = name;
        this.x = 50;
        this.y = 50;
        this.commandRate = commandRate;
        this.commands = [];

        // set update loop to apply commands
        this.updateThread = setInterval(update, 1000 / commandRate);
    }

    update = () => {
        // get next command and apply it
        const command = this.commands[0];
        this.commands.splice(0, 1); // remove next commands

        

    }

    applyCommand = (command) => {
        this,commands.push(command);
    }

    generatePacket = () => {
        return {
            x: this.x,
            y: this.y
        };
    }

    _remove = () => {
        clearInterval(this.updateThread);
    }

}
