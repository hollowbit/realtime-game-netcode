import Client from './client.js'; 

class CommandManager {

    constructor(commandRunner, positionSetter) {
        this.commandRunner = commandRunner;
        this.positionSetter = positionSetter;
        
        // keep track of command id
        this.lastId = 0;

        // key a log of all commands
        this.commandLog = [];
        this.commandsToSend = [];

        // initialize key values and listeners
        this.keys = { up: false, left: false, down: false, right: false };
        window.onkeyup = (e) => { this._onKeyUp(e.keyCode); };
        window.onkeydown = (e) => { this._onKeyDown(e.keyCode); };
    }

    // start thread to generate commands
    start() {
        // start command manager in 2 seconds, to be sure we start it when the server knows we will
        const commandStartTime = (+ new Date()) + 2000;
        setTimeout(() => {
            setInterval(() => { this._sendCommands(); }, 100); // sent command batch 10/s
        }, commandStartTime - (+ new Date()));

        return commandStartTime;
    }

    _sendCommands() {
        // send commands to server
        Client.networkManager.sendPacket({
            type: 'command',
            commands = this.commandsToSend
        });

        // clear commands list
        this.commandsToSend = [];
    }

    _onKeyUp(keyCode) {
        this._setKey(keyCode, false);
    }

    _onKeyDown(keyCode) {
        this._setKey(keyCode, true);
    }

    _setKey(keyCode, value) {
        switch(keyCode) {
            case 38: this.keys.up = value; break;
            case 37: this.keys.left = value; break;
            case 40: this.keys.down = value; break;
            case 39: this.keys.right = value; break;
        }
    }

    update(time, dt) {
        const command = {
            id: this.lastId++,
            clientTime: time,
            dt,
            ...this.keys
        };

        this.commandRunner(command, dt);
        this.commandLog.push(command);
        this.commandsToSend.push(command);
    }

    /**
     * Handle response of a command that was send to the server
     * @param {Object} packet 
     */
    onCommandResponse(response) {
        // set position to match server
        this.positionSetter(response.snapshot);

        // get command with id
        var id = this.commandLog.findIndex(command => command.id == response.id);

        // remove old commands from log
        this.commandLog.splice(0, id + 1);

        // go through each next command and run to catch up
        this.commandLog.forEach(command => {
            this.commandRunner(command);
        });
    }

}

export default CommandManager;