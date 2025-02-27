module.exports = function(modulePrefix, entityMap) {
    const manifestResult = {};
    const allEntities = [];
    for (const id in entityMap) {
        const realId = id.replace(modulePrefix, "");
        const entity = entityMap[id];

        manifestResult[realId] = {...entity.manifest};
        delete manifestResult[id];
        if (manifestResult[realId]) {
            delete manifestResult[realId].original;
        }

        entity.scripts = entity.scripts ? Object.keys(entity.scripts) : [];

        const imagePaths = ['images', 'mainImage'];
        for (const path of imagePaths) {
            if (entity[path]) {
                const data = entity[path];
                if (path !== "images") {
                    entity[path] = data.image.replace(modulePrefix, "");
                } else {
                    entity[path] = Object.keys(data || {}).reduce((obj, key) => {
                        if (!data[key].image) {
                            return obj;
                        }
                        return {
                            ...obj,
                            [key]: data[key].image.replace(modulePrefix, ""),
                        };
                    }, {});
                }
            }
        }

        if (!entity.sounds) {
            entity.sounds = {};
        } else {
            entity.sounds = Object.keys(entity.sounds).reduce((obj, key) => {
                return {
                    ...obj,
                    [key]: {
                        file: entity.sounds[key].rawPath,
                    },
                };
            }, {});
        }

        allEntities.push(entity);
    }

    return {
        manifestResult,
        allEntities,
    };
}