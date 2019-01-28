import Client from './client.js'; 

class CommandManager {

    constructor(commandRunner, positionSetter, commandRate) {
        this.commandRunner = commandRunner;
        this.positionSetter = positionSetter;
        this.commandRate = commandRate;
        
        // keep track of command id
        this.lastId = 0;

        // key a log of all commands
        this.commandLog = [];

        // initialize key values and listeners
        this.keys = { up: false, left: false, down: false, right: false };
        window.onkeyup = (e) => { this._onKeyUp(e.keyCode); };
        window.onkeydown = (e) => { this._onKeyDown(e.keyCode); };
    }

    // start thread to generate commands
    start() {
        // start command manager in 1 second, to be sure we start it when the server knows we will
        const commandStartTime = (+ new Date()) + 1000;
        setTimeout(() => {
            setInterval(() => { this._update(); }, 1000 / this.commandRate);
        }, commandStartTime - (+ new Date()));

        return commandStartTime;
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

    _update() {
        const time = + new Date();
        const command = {
            id: this.lastId++,
            clientTime: time,
            ...this.keys
        };

        this.commandRunner(command);
        Client.networkManager.sendPacket({type: 'command', command});
        this.commandLog.push(command);
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