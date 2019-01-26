import { CommandManager } from "./CommandManager";

const PLAYER_SIZE = 50;
const PLAYER_SPEED = 50;

class Player {

    constructor(name, commandRate) {
        this.name = name;
        this.x = 50;
        this.y = 50;

        this.commandManager = new CommandManager((command) => { this.runCommand(command); }, (snapshot) => { this.setWithSnapshot(snapshot); }, commandRate);
    }

    runCommand(command) {
        if (command.up) {
            this.y += PLAYER_SPEED * this.dt;
        }

        if (command.down) {
            this.y -= PLAYER_SPEED * this.dt;
        }
        
        if (command.right) {
            this.x += PLAYER_SPEED * this.dt;
        }
        
        if (command.left) {
            this.x -= PLAYER_SPEED * this.dt;
        }

        //TODO using world snapshots, check with collisions on other players at this timestamp

        // check for collisions with world
        if (this.x + PLAYER_SIZE >= WORLD_WIDTH) {
            this.x = WORLD_WIDTH - PLAYER_SIZE - 1;
        }

        if (this.y + PLAYER_SIZE >= WORLD_HEIGHT) {
            this.y = WORLD_HEIGHT - PLAYER_SIZE - 1;
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

    render(ctx) {
        
    }

}