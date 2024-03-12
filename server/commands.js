const fs = require('fs');
const path = require('path');

const {
    locateInDirectories,
    getJsonFile,
    getImageSlug,
    decodeImageSlug,
    locateInDirectoriesForSave,
    getCodeFile,
} = require('./utils');
const Logger = require("./logger");

const directories = {
    save: [
        path.resolve(__dirname, "..", "data", "saves"),
    ],
    modules: [
        path.resolve(__dirname, "..", "data", "modules"),
    ],
    map: [
        path.resolve(__dirname, "..", "data", "maps"),
    ],
};

module.exports = {
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
        const moduleData = {};
        const allImages = {};
        const allScripts = {};

        const tileData = Object.keys(manifest.tiles).reduce((obj, key) => {
            const tile = manifest.tiles[key];

            allImages[modulePrefix + tile.image] = getImageSlug('modules', tile.image, { extra: name });

            tile.rawImage = tile.image;
            tile.image = modulePrefix + tile.image;

            return {
                ...obj,
                [key]: tile,
            };
        }, {});
        moduleData.tiles = tileData;

        // grab all the object files
        const objects = Object.keys(manifest.objects || {});
        const allManifestObjects = {};

        for (const object of objects) {
            const manifestObjectData = manifest.objects[object];
            const manifestObjectPath = manifestObjectData.manifest;
            const fullManifestObjectPath = path.join(moduleDir, manifestObjectPath);

            if (!fs.existsSync(fullManifestObjectPath)) {
                Logger.error(`Cannot find manifest for ${object}: ${fullManifestObjectPath} not found`);
                continue;
            }

            const objectManifestData = getJsonFile(fullManifestObjectPath);
            objectManifestData.manifest = manifestObjectData;

            // process images
            if (objectManifestData.images) {
                for (const state in objectManifestData.images) {
                    const objectImagePath = objectManifestData.images[state];

                    allImages[modulePrefix + objectImagePath] = getImageSlug('modules', objectImagePath, { extra: name });

                    objectManifestData.images[state] = {
                        image: modulePrefix + objectImagePath,
                        rawPath: objectImagePath,
                    };
                }
            }

            // process scripts
            if (objectManifestData.scripts) {
                const objectScripts = {};
                for (const script of objectManifestData.scripts) {
                    const scriptPath = path.join(moduleDir, script);
                    const contents = getCodeFile(scriptPath);

                    allScripts[modulePrefix + script] = contents;
                    objectScripts[script] = {
                        script: modulePrefix + script,
                        rawPath: script,
                    };
                }
                objectManifestData.scripts = objectScripts;
            }

            allManifestObjects[object] = objectManifestData;
        }

        manifest.objects = allManifestObjects;

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
                message: "Couldn't find image in any directories",
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

        // process all our objects for writing
        const allObjects = [];
        for (const id in data.objects) {
            const object = data.objects[id];

            data.objects[id] = object.manifest;

            object.scripts = Object.keys(object.scripts);

            object.images = Object.keys(object.images).reduce((obj, key) => {
                return {
                    ...obj,
                    [key]: object.images[key].image.replace(modulePrefix, ""),
                };
            }, {});

            allObjects.push(object);
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

            const saveDataString = JSON.stringify(saveData, null, 4);

            fs.writeFileSync(fullManifestObjectPath, saveDataString);
        }

        return {
            success: true,
        };
    }
}