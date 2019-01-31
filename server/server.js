// initialize server
const { PlayerManager } = require('./Player');
const { NetworkManager } = require('./NetworkManager');
const networkManager = new NetworkManager(22122);
const {World} = require('./World');
const world = new World();

var startTime = (+ new Date());
setInterval(() => {
    PlayerManager.update();
}, 100);