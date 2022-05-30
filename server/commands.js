const fs = require('fs');
const path = require('path');

const { locateInDirectories, getJsonFile, getImageSlug, decodeImageSlug } = require('./utils');

const directories = {
    save: [
        path.resolve(__dirname, "..", "data", "saves"),
    ],
    modules: [
        path.resolve(__dirname, "..", "data", "modules"),
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
    getModule: ({ name }) => {
        const moduleDir = locateInDirectories(name, directories.modules);

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
                        image: getImageSlug('modules', tile.image, { extra: name }),
                    },
                };
            }, {}),
        };

        return {
            success: true,
            module: newManifest,
        };
    },
    getImage: ({ slug }) => {
        const decoded = decodeImageSlug(slug);

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
        };
    },
}