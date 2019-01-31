// initialize server
const { PlayerManager } = require('./Player');
const { NetworkManager } = require('./NetworkManager');
const networkManager = new NetworkManager(22122);
const {World} = require('./World');
const world = new World();

const SIMULATION_RATE = 20;
setInterval(() => {
    PlayerManager.update();
    world.update();
}, 1000 / SIMULATION_RATE);