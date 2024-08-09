let modules = {};

let computedData = {};

function updateComputedData() {
    const allTiles = {};
    const allImages = {};
    const allObjects = {};
    const allCharacters = {};
    const allScripts = {};
    const allEnemies = {};
    for (const module in modules) {
        const moduleData = modules[module];

        for (const tileId in moduleData.tiles) {
            allTiles[tileId] = moduleData.tiles[tileId];
        }

        for (const imageId in moduleData.images) {
            allImages[imageId] = moduleData.images[imageId];
        }

        for (const objectId in moduleData.objects) {
            allObjects[objectId] = moduleData.objects[objectId];
        }

        for (const id in moduleData.characters) {
            allCharacters[id] = moduleData.characters[id];
        }

        for (const id in moduleData.scripts) {
            allScripts[id] = moduleData.scripts[id];
        }

        for (const id in moduleData.enemies) {
            allEnemies[id] = moduleData.enemies[id];
        }
    }

    computedData = {
        images: allImages,
        tiles: allTiles,
        characters: allCharacters,
        objects: allObjects,
        scripts: allScripts,
        enemies: allEnemies,
    };
}

export function setModule(id, data) {
    modules = {
        ...modules,
        [id]: data,
    };
    updateComputedData();
}

export function getModule(id) {
    return {...modules[id]};
}

export function getModules() {
    return modules;
}

export function getTiles() {
    return computedData.tiles || {};
}

export function getImages() {
    return computedData.images || {};
}

export function getCharacters() {
    return computedData.characters || {};
}

export function getObjects() {
    return computedData.objects || {};
}

export function getScripts() {
    return computedData.scripts || {};
}

export function getEnemies() {
    return computedData.enemies || {};
}