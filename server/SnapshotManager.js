const SNAPSHOT_UPDATE_RATE = 20; // per second

class SnapshotManager {

    constructor() {
        this.log = new Map();

        // set 
        setInterval(update, 1000 / SNAPSHOT_UPDATE_RATE);
    }

    // update a 20hz
    update = () => {

    }

}
