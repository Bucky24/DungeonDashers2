const fs = require('fs');
const path = require('path');
const getAppDataPath = require("appdata-path");

const Logger = require("./logger");

const userPath = getAppDataPath("DungeonDashers2");
if (!fs.existsSync(userPath)) {
    fs.mkdirSync(userPath);
}

console.log(`Using ${userPath} as data directory for user`);

// TODO: need to lock this down in case of electron we don't
// allow saving to these directories or loading from editor
// however right now we don't know what we are doing, game
// should still be able to load from these
const directories = {
    saves: {
        load: [
            path.resolve(__dirname, "..", "data", "saves"),
            path.resolve(userPath, "saves"),
        ],
        save: [],
    },
    modules: {
        load: [
            path.resolve(__dirname, "..", "data", "modules"),
            path.resolve(userPath, "modules"),
        ],
        save: [],
    },
    maps: {
        load: [
            path.resolve(__dirname, "..", "data", "maps"),
            path.resolve(userPath, "maps"),
        ],
        save: [],
    },
    campaigns: {
        load: [
            path.resolve(__dirname, "..", "data", "campaigns"),
            path.resolve(userPath, "campaigns"),
        ],
        save: [],
    },
};

// if running a dev build, then we can write to the system default modules
if (process.env.NODE_ENV === 'development') {
    directories.saves.save.unshift(directories.saves.load[0]);
    directories.modules.save.unshift(directories.modules.load[0]);
    directories.maps.save.unshift(directories.maps.load[0]);
    directories.campaigns.save.unshift(directories.campaigns.load[0]);
} else {
    directories.saves.save.unshift(directories.saves.load[1]);
    directories.modules.save.unshift(directories.modules.load[1]);
    directories.maps.save.unshift(directories.maps.load[1]);
    directories.campaigns.save.unshift(directories.campaigns.load[1]);
}

function locateInDirectories(name, dirs, extra = '') {
    let foundFile = null;

    if (name === "") {
        return foundFile;
    }

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

function getAssetSlug(fileType, type, filePath, data) {
    const resultObj = {
        fileType,
        type,
        filePath,
        data,
    };

    return btoa(JSON.stringify(resultObj));
}

function getAllInDirectories(dirs) {
    const files = [];

    for (const dir of dirs) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        const contents = fs.readdirSync(dir);

        for (const file of contents) {
            if (file.endsWith(".json")) {
                files.push({
                    name: path.parse(file).name,
                    path: path.join(dir, file),
                });
            }
        }
    }

    return files;
}

function getAllDirsInDirectories(dirs) {
    const result = [];

    for (const dir of dirs) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        const contents = fs.readdirSync(dir);

        for (const file of contents) {
            const fullPath = path.join(dir, file);
            if (fs.lstatSync(fullPath).isDirectory()) {
                result.push({
                    name: file,
                    path: fullPath,
                });
            }
        }
    }

    return result;
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
    getAssetSlug,
    decodeImageSlug: (slug) => {
        try {
        const json = JSON.parse(atob(slug));

        return json;
        } catch (e) {
            Logger.error(`Error decoding image slug ${slug}: ${e.error}`);

            return null;
        }
    },
    getModuleComponent: (module, moduleDir, componentManifest, allScripts, allImages, componentName) => {
        const manifestPath = componentManifest.manifest;
        const fullManifestPath = path.join(moduleDir, manifestPath);
        const modulePrefix = module + "_";

        if (!fs.existsSync(fullManifestPath)) {
            Logger.error(`Cannot find manifest for ${componentName}: ${fullManifestPath} not found`);
            return;
        }

        const objectData = getJsonFile(fullManifestPath);
        objectData.manifest = componentManifest;
        objectData.manifest.original = componentManifest.manifest;

        objectData.id = modulePrefix + objectData.id;

        const imagePaths = ['images', 'mainImage'];

        // process images
        for (const path of imagePaths) {
            if (objectData[path]) {
                const imageData = objectData[path];
                if (typeof imageData === 'string') {
                    allImages[modulePrefix + imageData] = getAssetSlug('image', 'modules', imageData, { extra: module });

                    objectData[path] = {
                        image: modulePrefix + imageData,
                        rawPath: imageData,
                    };
                } else {
                    for (const state in imageData) {
                        const objectImagePath = imageData[state];
                        if (objectImagePath === "") {
                            continue;
                        }

                        allImages[modulePrefix + objectImagePath] = getAssetSlug('image', 'modules', objectImagePath, { extra: module });

                        imageData[state] = {
                            image: modulePrefix + objectImagePath,
                            rawPath: objectImagePath,
                        };
                    }
                }
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

        // process sounds
        allSounds = {};
        if (objectData.sounds) {
            for (const key in objectData.sounds) {
                const myKey = modulePrefix + key + "_" + componentName;
                const soundData = objectData.sounds[key];
                allSounds[myKey] = getAssetSlug('sound', 'modules', soundData.file, { extra: module });

                objectData.sounds[key] = {
                    sound: myKey,
                    rawPath: soundData.file,
                };
            }
        } else {
            objectData.sounds = {};
        }

        return {
            objectData,
            sounds: allSounds,
        };
    },
    getAllInDirectories,
    getAllDirsInDirectories,
};