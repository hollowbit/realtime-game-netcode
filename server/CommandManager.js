class CommandManager {

    constructor(commandRunner, snapshotGetter, commandStartTime, connection) {
        this.commandRunner = commandRunner;
        this.snapshotGetter = snapshotGetter;
        this.commandStartTime = commandStartTime;
        this.connection = connection;

        this.commands = [];
        this.currentCommandTime = commandStartTime;
    }

    giveCommands(commands) {
        this.commands.push(...commands);
    }

    update() {
        // don't bother if there are no commands
        if (this.commands.length == 0) {
            return;
        }

        // get next commands and apply them
        this.commands.forEach((command) => {
            this.currentCommandTime += Math.floor(command.dt * 1000);

            // the client and server have a different time that is always consistent from the initial setup.
            // set it first time, if it changes, they are tampering with their timestamp
            if (this.timeDifference === undefined) {
                this.currentCommandTime += Math.floor(command.dt * 1000);
                this.timeDifference = command.clientTime - this.currentCommandTime;
            } else {
                command.clientTime -= this.timeDifference;
            }

            console.log(`Command:  ${command.clientTime}     ${this.currentCommandTime}   Diff: ${command.clientTime - this.currentCommandTime}`);

            // run the command
            this.commandRunner(command, this.currentCommandTime, command.dt);

            // send the response packet
            this.connection.sendPacket({
                type: 'commandresponse',
                response: {
                    id: command.id,
                    time: command.time,
                    dt: command.dt,
                    snapshot: this.snapshotGetter()
                }
            });
        });
        this.commands = [];
    }

}

module.exports.CommandManager = CommandManager;