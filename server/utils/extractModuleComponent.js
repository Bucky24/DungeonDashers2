module.exports = function(modulePrefix, entityMap) {
    const manifestResult = {};
    const allEntities = [];
    for (const id in entityMap) {
        const realId = id.replace(modulePrefix, "");
        const entity = entityMap[id];

        manifestResult[realId] = {...entity.manifest};
        delete manifestResult[id];
        delete manifestResult[realId].original;

        entity.scripts = entity.scripts ? Object.keys(entity.scripts) : [];

        entity.images = Object.keys(entity.images || {}).reduce((obj, key) => {
            return {
                ...obj,
                [key]: entity.images[key].image.replace(modulePrefix, ""),
            };
        }, {});

        allEntities.push(entity);
    }

    return {
        manifestResult,
        allEntities,
    };
}