import Player from './Player.js';

class EntityManager {

    constructor() {
        // initialize entity types
        this.entities = new Map();
        this.entities.set('Player', Player);
    }

    render(renderer, snapshot) {
        // get entity class to render it
        const entity = this.entities.get(snapshot.type);
        if (entity != null) {
            entity.render(renderer, snapshot);
        }
    }

    getEntityInterpolatableProperties(entityType) {
        // get interpolatable properties of the given entity
        const entity = this.entities.get(entityType);
        if (entity != null) {
            return entity.propertiesInterpolatable;
        }

        return undefined;
    }

}

export default EntityManager;