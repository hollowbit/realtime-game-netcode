import Player from './Player.js';
import World from './World.js';
import NetworkManager from './NetworkManager.js';
import Renderer from './Renderer.js';

const FPS = 60;

class Client {
    
    constructor() {
        this.player = new Player(prompt("Please pick a name"), 60);
        this.world = new World(100, this.player);
        this.networkManager = new NetworkManager('178.128.227.25', 22122);

        this._renderer = new Renderer(document.getElementById('render'));

        setInterval(() => { this.render(this._renderer); }, 1000 / FPS);

        this.startTime = (+ new Date());
    }

    render(renderer) {
        // calculate current time and delta time
        const time = (+ new Date());
        const dt = (time - this.startTime) / 1000;
        this.startTime = time;

        this.player.update(time, dt);
        this.world.render(renderer, time);
    }

}

export default new Client();
