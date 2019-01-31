import CommandManager from "./CommandManager.js";
import { WORLD_WIDTH, WORLD_HEIGHT } from "./World.js";

const PLAYER_SIZE = 50;
const PLAYER_SPEED = 250;

export default class Player {

    constructor(name) {
        this.name = name;

        this.x = 50;
        this.y = 50;

        this.commandManager = new CommandManager((command) => { this.runCommand(command); }, (snapshot) => { this.setWithSnapshot(snapshot); }, commandRate);
    }

    connect() {
        const commandStartTime = this.commandManager.start();

        // create connection packet
        const connectPacket = {
            type: 'connect',
            playerName: this.name,
            commandRate: this.commandManager.commandRate,
            commandStartTime
        }
        return connectPacket;
    }

    update(time, dt) {
        this.commandManager.update(time, dt);
    }

    runCommand(command, dt) {
        if (command.up) {
            this.y -= PLAYER_SPEED * dt;
        }

        if (command.down) {
            this.y += PLAYER_SPEED * dt;
        }
        
        if (command.right) {
            this.x += PLAYER_SPEED * dt;
        }
        
        if (command.left) {
            this.x -= PLAYER_SPEED * dt;
        }

        //TODO using world snapshots, check with collisions on other players at this timestamp

        // check for collisions with world
        
        if (this.x + PLAYER_SIZE > WORLD_WIDTH) {
            this.x = WORLD_WIDTH - PLAYER_SIZE;
        }

        if (this.y + PLAYER_SIZE > WORLD_HEIGHT) {
            this.y = WORLD_HEIGHT - PLAYER_SIZE;
        }

        if (this.x < 0) {
            this.x = 0;
        }

        if (this.y < 0) {
            this.y = 0;
        }
    }

    setWithSnapshot(snapshot) {
        this.x = snapshot.x;
        this.y = snapshot.y;
    }

    generateSnapshot() {
        return {
            x: this.x,
            y: this.y,
            type: 'Player'
        }
    }

}

Player.propertiesInterpolatable = ['x', 'y'];
Player.render = (renderer, snapshot) => {
    renderer.drawSquare(snapshot.x, snapshot.y, PLAYER_SIZE, 'red');
}