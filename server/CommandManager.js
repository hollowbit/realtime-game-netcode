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
            this.currentCommandTime += command.dt;

            // run the command
            this.commandRunner(command, this.currentCommandTime, command.dt);

            // send the response packet
            this.connection.sendPacket({
                type: 'commandresponse',
                response: {
                    id: command.id,
                    time: command.time,
                    snapshot: this.snapshotGetter()
                }
            });
        });
        this.commands = [];
    }

}

module.exports.CommandManager = CommandManager;