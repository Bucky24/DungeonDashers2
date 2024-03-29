const fs = require('fs');
const path = require('path');

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
    campaign: [
        path.resolve(__dirname, "..", "data", "campaigns"),
    ],
};

function locateInDirectories(name, dirs, extra = '') {
    let foundFile = null;

    for (const dir of dirs) {
        let fullPath = path.join(dir, name);
        if (extra || extra !== '') {
            fullPath = path.join(dir, extra, name);
        }

        // security. If someone uses a .. in the name, then we won't contain the full dir anymore
        if (!fullPath.startsWith(dir)) {
            continue;
        }

        if (fs.existsSync(fullPath)) {
            foundFile = fullPath;
            break;
        }
    }

    return foundFile;
}

function getJsonFile(file) {
    if (!fs.existsSync(file)) {
        return null;
    }

    const contents = fs.readFileSync(file, 'utf8');
    return JSON.parse(contents);
}

function getCodeFile(file) {
    if (!fs.existsSync(file)) {
        return "";
    }

    const contents = fs.readFileSync(file, 'utf8');
    return contents;
}

function getImageSlug(type, filePath, data) {
    const resultObj = {
        type,
        filePath,
        data,
    };

    return btoa(JSON.stringify(resultObj));
}

module.exports = {
    directories,
    locateInDirectories,
    locateInDirectoriesForSave: (name, dirs, extra = '') => {
        let file = locateInDirectories(name, dirs, extra);
        if (file) {
            return file;
        }

        if (dirs.length === 0) {
            return null;
        }

        const firstDir = dirs[0];
        const fullFile = path.join(firstDir, extra, name);

        // security. If someone uses a .. in the name, then we won't contain the full dir anymore
        if (!fullFile.startsWith(firstDir)) {
            return null;
        }

        return fullFile;
    },
    getJsonFile,
    getCodeFile,
    getImageSlug,
    decodeImageSlug: (slug) => {
        try {
        const json = JSON.parse(atob(slug));

        return json;
        } catch (e) {
            Logger.error(`Error decoding image slug ${slug}: ${e.error}`);

            return null;
        }
    },
    getModuleComponent: (module, moduleDir, componentManifest, allScripts, allImages) => {
        const manifestPath = componentManifest.manifest;
        const fullManifestPath = path.join(moduleDir, manifestPath);
        const modulePrefix = module + "_";

        if (!fs.existsSync(fullManifestPath)) {
            Logger.error(`Cannot find manifest for ${object}: ${fullManifestPath} not found`);
            return;
        }

        const objectData = getJsonFile(fullManifestPath);
        objectData.manifest = componentManifest;
        objectData.manifest.original = componentManifest.manifest;

        objectData.id = modulePrefix + objectData.id;

        // process images
        if (objectData.images) {
            for (const state in objectData.images) {
                const objectImagePath = objectData.images[state];

                allImages[modulePrefix + objectImagePath] = getImageSlug('modules', objectImagePath, { extra: module });

                objectData.images[state] = {
                    image: modulePrefix + objectImagePath,
                    rawPath: objectImagePath,
                };
            }
        }

        // process scripts
        if (objectData.scripts) {
            const objectScripts = {};
            for (const script of objectData.scripts) {
                const scriptPath = path.join(moduleDir, script);
                const contents = getCodeFile(scriptPath);

                allScripts[modulePrefix + script] = contents;
                objectScripts[script] = {
                    script: modulePrefix + script,
                    rawPath: script,
                };
            }
            objectData.scripts = objectScripts;
        }

        return objectData;
    }
};