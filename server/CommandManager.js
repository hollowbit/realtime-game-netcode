class CommandManager {

    constructor(commandRunner, snapshotGetter, commandStartTime, connection) {
        this.commandRunner = commandRunner;
        this.snapshotGetter = snapshotGetter;
        this.commandStartTime = commandStartTime;
        this.connection = connection;

        this.currentCommandTime = commandStartTime;

        this.commands = [];
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

            // prepare response
            const response = {
                type: 'commandresponse',
                response: {
                    id: command.id,
                    time: command.time,
                    dt: command.dt
                }
            };

            // the client and server have a different time that is always consistent from the initial setup.
            // set it first time, if it changes, they are tampering with their timestamp
            if (this.timeDifference === undefined) {
                const currentCommandTime = this.commandStartTime +  Math.floor(command.dt * 1000);
                this.timeDifference = command.time - currentCommandTime;
                this.currentCommandTime += this.timeDifference;
            }
            
            // adjust time to match server time
            command.time -= this.timeDifference;
            
            // if client command time is greater than current time, you can tell they are cheating
            if (command.time > (+ new Date())) {
                console.log("cheating detected!");
            }

            // run the command
            this.commandRunner(command);

            // get snapshot and send the response packet
            response.snapshot = this.snapshotGetter();
            this.connection.sendPacket(response);
        });
        this.commands = [];
    }

}

module.exports.CommandManager = CommandManager;