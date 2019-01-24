class PlayerManager {

    constructor() {
        this.players = new Map();

        // set thread to update players
        setInterval(update, 1000 / PLAYER_COMMAND_UPDATE_RATE);
    }

    // create a new player and return it
    createPlayer = (name) => {
        const player = new Player(command.player);
        this.players.set(command.player, player);
        return player;
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
        setInterval(update, 1000 / commandRate);
    }

    update = () => {
        // get next command and apply it
        const command = this.commands[0];
        this.commands.splice(0, 1); // remove next commands

        

    }

    applyCommand = (command) => {
        // TODO apply command with lag compensation
    }

    generatePacket = () => {
        return {
            x: this.x,
            y: this.y
        };
    }

}
