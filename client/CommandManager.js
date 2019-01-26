const NetworkManager = require('./client').NetworkManager;

class CommandManager {

    constructor(commandRunner, positionSetter, commandRate) {
        this.commandRunner = commandRunner;
        this.positionSetter = positionSetter;
        this.commandRate = commandRate;
        
        // keep track of command id
        this.lastId = 0;

        // key a log of all commands
        this.commandLog = [];

        // start thread to generate commands
        setInterval(() => { this._update(); }, 1000 / commandRate);

        // initialize key values and listeners
        this.keys = { up: false, left: false, down: false, right: false };
        window.onkeyup = (e) => { _onKeyUp(e.keyCode); };
        window.onkeydown = (e) => { _onKeyDown(e.keyCode); };
    }

    _onKeyUp(keyCode) {
        _setKey(keyCode, false);
    }

    _onKeyDown(keyCode) {
        _setKey(keyCode, true);
    }

    _setKey(keyCode, value) {
        switch(keyCode) {
            case 38: this.keys.up = value; break;
            case 37: this.keys.left = value; break;
            case 40: this.keys.down = value; break;
            case 39: this.keys.right = value; break;
        }
    }

    _update() {
        const command = {
            id: this.lastId++,
            clientTime: + new Date(),
            ...keys
        };

        this.commandRunner(command);
        NetworkManager.sendPacket({type: 'command', command});
        this.commandLog.push(command);
    }

    /**
     * Handle response of a command that was send to the server
     * @param {Object} packet 
     */
    onCommandResponse(response) {
        // set position to match server
        positionSetter(response.snapshot);

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

module.exports.CommandManager = CommandManager;