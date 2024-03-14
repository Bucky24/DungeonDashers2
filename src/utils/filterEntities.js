function doesEntityMatchFilter(entity, filter) {
    if (filter === 'entity_character') {
        return entity.type === "character";
    } else if (filter === 'entity_object') {
        return entity.type === 'object';
    } else if (filter === 'entity_enemy') {
        return entity.type === 'enemy';
    }
}

export default function filterEntities(entities, filters) {
    return entities.filter((entity) => {
        for (let i=0;i<filters.length;i++) {
            if (doesEntityMatchFilter(entity, filters[i])) {
                return true;
            }
        }

        return false;
    });
}