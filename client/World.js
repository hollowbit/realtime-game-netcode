import EntityManager from './EntityManager.js';
import Player from './Player.js';

export const WORLD_WIDTH = 640;
export const WORLD_HEIGHT = 480;

class World {

    constructor(renderDelay, player) {
        this.renderDelay = renderDelay;
        this.player = player;

        this.entityManager = new EntityManager();
        this.snapshots = [];
        this.ping = 0;
    }

    giveSnapshot(snapshot) {
        // set ping
        this.ping = (+ new Date()) - snapshot.time;

        this.snapshots.push(snapshot);
    }

    render(renderer) {
        //render the player
        Player.render(renderer, this.player.generateSnapshot());

        // calculate time to render at
        const renderTime = (+ new Date()) - (2 * this.ping + this.renderDelay);

        // find snapshots to interpolate with
        var firstIndex, first, last;
        for (var i = 0; i < this.snapshots.length; i++) {
            last = this.snapshots[i];
            if (last.time > renderTime) {
                break;
            }

            first = this.snapshots[i];
            firstIndex = i;
        }

        // don't render if we don't have enough snapshots to use
        if (first == undefined || last == first) {
            return;
        }

        // remove old snapshots
        this.snapshots.splice(0, firstIndex);

        // go through snapshots and create the interpolated version
        for (var name in first.snapshots) {

            // skip player
            if (name == this.player.name) {
                continue;
            }

            const snapshot = first.snapshots[name];
            const snapshotLast = last.snapshots[name];

            // skip if there is no last snapshot for this entity
            if (snapshotLast == undefined) {
                continue;
            }

            // generate a snapshot representing the entity at the current render time
            var snapshotCurrent = {};

            const interpolatableProperties = this.entityManager.getEntityInterpolatableProperties(snapshot.type);
            for (var prop in snapshot) {
                const value = snapshot[prop];

                // check if interpolatable
                if (interpolatableProperties.includes(prop)) {
                    // get last snapshot and interpolate between the values
                    const snapshotLastValue = snapshotLast[prop];
                    snapshotCurrent[prop] = this._interpolate(first.time, value, last.time, snapshotLastValue, renderTime);
                } else { // if not, just set it
                    snapshotCurrent[prop] = value;
                }
            }

            // render using the generated snapshot
            this.entityManager.render(renderer, snapshotCurrent);
        }
    }

    _interpolate(timeSnapshot1, valueSnapshot1, timeSnapshot2, valueSnapshot2, timeCurrent) {
        return (timeCurrent - timeSnapshot1) / (timeSnapshot2 - timeSnapshot1) * (valueSnapshot2 - valueSnapshot1) + valueSnapshot1;
    }

}

export default World;