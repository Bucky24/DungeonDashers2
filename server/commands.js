const fs = require('fs');
const path = require('path');

const {
    locateInDirectories,
    getJsonFile,
    getImageSlug,
    decodeImageSlug,
    locateInDirectoriesForSave,
    getModuleComponent,
    directories,
} = require('./utils');
const getSettings = require("./commands/getSettings");

module.exports = {
    getSettings,
    getSavedGames: () => {
        return {
            success: true,
            games: ['main'],
        };
    },
    getSavedGame: ({ name }) => {
        const file = locateInDirectories(`${name}.json`, directories.save);

        if (!file) {
            return {
                success: false,
                message: "Can't locate save in any directory",
            };
        }

        const content = getJsonFile(file);

        return {
            success: true,
            game: content,
        };
    },
    getMap: ({ name }) => {
        const file = locateInDirectories(`${name}.json`, directories.map);

        if (!file) {
            return {
                success: false,
                message: "Can't locate map in any directory",
            };
        }

        const map = getJsonFile(file);

        return {
            success: true,
            map,
        };
    },
    getModule: ({ name }) => {
        const moduleDir = locateInDirectories(name, directories.modules);

        const modulePrefix = `${name}_`;

        if (!moduleDir) {
            return {
                success: false,
                message: "Can't locate module in any direectory",
            };
        }

        const manifestFile = path.join(moduleDir, "manifest.json");

        if (!fs.existsSync(manifestFile)) {
            return {
                success: false,
                message: "No manifest file found in module directory",
            };
        }

        const manifest = getJsonFile(manifestFile);
        const allImages = {};
        const allScripts = {};

        const tileData = Object.keys(manifest.tiles).reduce((obj, key) => {
            const tile = manifest.tiles[key];

            allImages[modulePrefix + tile.image] = getImageSlug('modules', tile.image, { extra: name });

            tile.rawImage = tile.image;
            tile.image = modulePrefix + tile.image;

            return {
                ...obj,
                [modulePrefix + key]: tile,
            };
        }, {});
        manifest.tiles = tileData;

        // grab all the object files
        const objects = Object.keys(manifest.objects || {});
        const allManifestObjects = {};
        for (const object of objects) {
            objectManifestData = getModuleComponent(name, moduleDir, manifest.objects[object], allScripts, allImages);

            allManifestObjects[modulePrefix + object] = objectManifestData;
        }
        manifest.objects = allManifestObjects;

        // grab all the character files
        const characters = Object.keys(manifest.characters || {});
        const allManifestCharacters = {};
        for (const character of characters) {
            characterManifestData = getModuleComponent(name, moduleDir, manifest.characters[character], allScripts, allImages);

            allManifestCharacters[modulePrefix + character] = characterManifestData;
        }
        manifest.characters = allManifestCharacters;

        // grab all the enemy files
        const enemies = Object.keys(manifest.enemies || {});
        const allManifestEnemies = {};
        for (const enemy of enemies) {
            enemyManifestData = getModuleComponent(name, moduleDir, manifest.enemies[enemy], allScripts, allImages);

            allManifestEnemies[modulePrefix + enemy] = enemyManifestData;
        }
        manifest.enemies = allManifestEnemies;

        manifest.images = allImages;
        manifest.scripts = allScripts;

        return {
            success: true,
            module: manifest,
        };
    },
    getImage: ({ slug }) => {
        const decoded = decodeImageSlug(slug);

        if (!decoded) {
            return {
                success: false,
                message: 'Malformed slug',
            };
        }

        const validDirectories = directories[decoded.type] || [];
        const extra = decoded.data?.extra ?? '';

        const imageFile = locateInDirectories(decoded.filePath, validDirectories, extra);

        if (!imageFile) {
            return {
                success: false,
                message: `Couldn't find image ${decoded.filePath} in any directories`,
            };
        }

        const fullImage = fs.readFileSync(imageFile).toString('base64');
        // assuming PNG here, we may need to fix this at some point
        const imageData = "data:image/png;base64," + fullImage;

        return {
            success: true,
            image: imageData,
            url: decoded.filePath,
        };
    },
    saveMap: ({ name, data }) => {
        const file = locateInDirectoriesForSave(`${name}.json`, directories.map);
        
        if (!file) {
            return {
                success: false,
                message: "Unable to find appropriate save location",
            };
        }

        const dataString = JSON.stringify(data, null, 4);

        fs.writeFileSync(file, dataString);

        return {
            success: true,
        };
    },
    saveModule: ({ name, data }) => {
        const dir = locateInDirectoriesForSave(`${name}`, directories.modules);
        const modulePrefix = `${name}_`;

        if (!dir) {
            return {
                success: false,
                message: "Unable to find appropriate save location",
            };
        }

        // process tiles
        for (const id in data.tiles) {
            const realId = id.replace(modulePrefix, "");
            data.tiles[realId] = data.tiles[id];
            delete data.tiles[id];
        }

        // process all our objects for writing
        const allObjects = [];
        for (const id in data.objects) {
            const realId = id.replace(modulePrefix, "");
            const object = data.objects[id];

            data.objects[realId] = {...object.manifest};
            delete data.objects[id];
            delete data.objects[realId].original;

            object.scripts = object.scripts ? Object.keys(object.scripts) : [];

            object.images = Object.keys(object.images).reduce((obj, key) => {
                return {
                    ...obj,
                    [key]: object.images[key].image.replace(modulePrefix, ""),
                };
            }, {});

            allObjects.push(object);
        }

        // process all our objects for writing
        const allCharacters = [];
        for (const id in data.characters) {
            const realId = id.replace(modulePrefix, "");
            const entity = data.characters[id];

            data.characters[realId] = {...entity.manifest};
            delete data.characters[id];
            delete data.characters[realId].original;

            entity.scripts = entity.scripts ? Object.keys(entity.scripts) : [];

            entity.images = Object.keys(entity.images).reduce((obj, key) => {
                return {
                    ...obj,
                    [key]: entity.images[key].image.replace(modulePrefix, ""),
                };
            }, {});

            allCharacters.push(entity);
        }

        const manifestFile = path.join(dir, "manifest.json");

        const dataString = JSON.stringify(data, null, 4);

        fs.writeFileSync(manifestFile, dataString);

        // write objects
        for (const object of allObjects) {
            const manifestObjectPath = object.manifest.manifest;
            const fullManifestObjectPath = path.join(dir, manifestObjectPath);

            const saveData = {...object};
            delete saveData.manifest;
            saveData.id = saveData.id.replace(modulePrefix, "");

            const saveDataString = JSON.stringify(saveData, null, 4);

            fs.writeFileSync(fullManifestObjectPath, saveDataString);

            if (object.manifest.manifest !== object.manifest.original) {
                // clean up the old file   
                const oldManifestObjectPath = path.join(dir, object.manifest.original);
                fs.rmSync(oldManifestObjectPath);
            }
        }

        // write characters
        for (const entity of allCharacters) {
            const manifestPath = entity.manifest.manifest;
            const fullManifestPath = path.join(dir, manifestPath);

            const saveData = {...entity};
            delete saveData.manifest;
            saveData.id = saveData.id.replace(modulePrefix, "");

            const saveDataString = JSON.stringify(saveData, null, 4);

            fs.writeFileSync(fullManifestPath, saveDataString);

            if (entity.manifest.manifest !== entity.manifest.original) {
                // clean up the old file   
                const oldManifestPath = path.join(dir, entity.manifest.original);
                fs.rmSync(oldManifestPath);
            }
        }

        return {
            success: true,
        };
    }
}