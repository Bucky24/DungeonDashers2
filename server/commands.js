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
    getAllInDirectories,
} = require('./utils');
const getSettings = require("./commands/getSettings");
const extractModuleComponent = require("./utils/extractModuleComponent");
const writeModuleComponents = require('./utils/writeModuleComponents');
const saveGame = require("./commands/saveGame");
const loadCampaign = require("./commands/loadCampaign");
const getMapNames = require("./commands/getMapNames");
const getCampaignNames = require("./commands/getCampaignNames");
const saveCampaign = require("./commands/saveCampaign");
const updateCampaignSave = require("./commands/updateCampaignSave");
const loadSavedCampaign = require("./commands/loadSavedCampaign");
const getModuleNames = require("./commands/getModuleNames");
const setSetting = require("./commands/setSetting");

module.exports = {
    getSettings,
    saveGame,
    loadCampaign,
    getMapNames,
    getCampaignNames,
    saveCampaign,
    updateCampaignSave,
    loadSavedCampaign,
    getModuleNames,
    setSetting,
    getSavedGames: () => {
        const allSaves = getAllInDirectories(directories.saves.load);

        const filteredSaves = allSaves.filter((save) => {
            return !save.name.includes("__CAMPAIGN");
        }).map((data) => data.name);

        return {
            success: true,
            games: filteredSaves,
        };
    },
    getSavedGame: ({ name }) => {
        const file = locateInDirectories(`${name}.json`, directories.saves.load);

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
        const file = locateInDirectories(`${name}.json`, directories.maps.load);

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
        const moduleDir = locateInDirectories(name, directories.modules.load);

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

        const validDirectories = directories[decoded.type].load || [];
        const extra = decoded.data?.extra ?? '';

        const imageFile = locateInDirectories(decoded.filePath, validDirectories, extra);

        if (!imageFile) {
            console.error('Can\'t find image', decoded, 'in directories', validDirectories);
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
        const file = locateInDirectoriesForSave(`${name}.json`, directories.maps.save);
        
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
        const dir = locateInDirectoriesForSave(`${name}`, directories.modules.save);
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
        let component = extractModuleComponent(modulePrefix, data.objects);
        const allObjects = component.allEntities;
        data.objects = component.manifestResult;

        // process all our characters for writing
        component = extractModuleComponent(modulePrefix, data.characters);
        const allCharacters = component.allEntities;
        data.characters = component.manifestResult;

        // process all our enemies for writing
        component = extractModuleComponent(modulePrefix, data.enemies);
        const allEnemies = component.allEntities;
        data.enemies = component.manifestResult;

        const manifestFile = path.join(dir, "manifest.json");

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const dataString = JSON.stringify(data, null, 4);

        fs.writeFileSync(manifestFile, dataString);

        // write objects
        writeModuleComponents(modulePrefix, dir, allObjects);

        // write characters
        writeModuleComponents(modulePrefix, dir, allCharacters);

        // write enemies
        writeModuleComponents(modulePrefix, dir, allEnemies);

        return {
            success: true,
        };
    }
}