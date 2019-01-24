class PlayerManager {

    constructor() {
        this.players = new Map();

        // set thread to update players
        setInterval(update, 1000 / PLAYER_COMMAND_UPDATE_RATE);
    }

    // give a command to be handled later
    giveCommand = (command) => {
        var player = this.players.get(command.player);

        // if the player doesn't exist, create a new one
        if (player == null) {
            player = createPlayer(command.player);
        }

        // apply the command on the player
        player.applyCommand(command);
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

    constructor(name) {
        this.name = name;
        this.x = 50;
        this.y = 50;
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
