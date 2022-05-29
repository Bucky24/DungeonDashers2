const fs = require('fs');
const path = require('path');

const { locateInDirectories, getJsonFile, getImageSlug } = require('./utils');

const saveDirectories = [
    path.resolve(__dirname, "..", "data", "saves"),
];

const moduleDirectories = [
    path.resolve(__dirname, "..", "data", "modules"),
];

module.exports = {
    getSavedGames: () => {
        return {
            success: true,
            games: ['main'],
        };
    },
    getSavedGame: ({ name }) => {
        const file = locateInDirectories(`${name}.json`, saveDirectories);

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
    getModule: ({ name }) => {
        const moduleDir = locateInDirectories(name, moduleDirectories);

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

        const newManifest = {
            ...manifest,
            tiles: Object.keys(manifest.tiles).reduce((obj, key) => {
                const tile = manifest.tiles[key];

                return {
                    ...obj,
                    [key]: {
                        ...tile,
                        image: getImageSlug('tile', tile.image, { module: name }),
                    },
                };
            }, {}),
        };

        return {
            success: true,
            module: newManifest,
        };
    }
}