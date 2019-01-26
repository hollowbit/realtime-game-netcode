class CommandManager {

    constructor(commandRunner, snapshotGetter, commandRate, commandStartTime, connection) {
        this.commandRunner = commandRunner;
        this.snapshotGetter = snapshotGetter;
        this.commandRate = commandRate;
        this.commandStartTime = commandStartTime;
        this.connection = connection;

        this.commands = [];
        this.dt = 1 / commandRate;
        this.commandReceived = 0;

        // set update loop to apply commands
        this.updateThread = setInterval(() => { this._update(); }, 1000 / commandRate);
    }

    giveCommand(command) {
        // calculate estimated creation time of command
        command.time = this.commandStartTime + ((1000 / commandRate) * this.commandReceived);
        this.commandReceived++;

        this.commands.push(command);
    }

    _update() {
        // don't bother if there are no commands
        if (this.commands.length == 0) {
            return;
        }

        // get next command and apply it
        const command = this.commands[0];
        this.commands.splice(0, 1); // remove next commands

        // run the command
        this.commandRunner(command);

        // send the response packet
        connection.sendPacket({
            type: 'commandresponse',
            response: {
                id: command.id,
                time: command.time,
                snapshot: this.snapshotGetter()
            }
        });
    }

    remove() {
        clearInterval(this.updateThread);
    }

}

module.exports.CommandManager = CommandManager;