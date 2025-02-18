import React, { useContext, useEffect, useState } from 'react';

import Coms from '../utils/coms';
import AssetContext from './AssetContext';
import { TILE_TYPE } from './MapContext';
import {
    getModules,
    setModule,
    getModule,
    getTiles,
    getObjects,
    getCharacters,
    getEnemies,
    getScripts,
    getImages,
    getEquipment,
} from '../data/moduleData';
import useRender from '../hooks/useRender';

const ModuleContext = React.createContext({});
export default ModuleContext;

const NUMERIC_ENTITY_FILEDS = [
    'width',
    'height',
    'actionPoints',
    'maxHP',
];

export function ModuleProvider({ children }) {
    const [loaded, setLoaded] = useState(false);
    const { loadImage, images: loadedImages, loadSound } = useContext(AssetContext);
    const render = useRender();
    const modules = getModules();

    const updateEntity = (modules, module, type, id, key, value) => {
        if (key === "id") {
            // prevent actually deleting the entity if it's the same
            if (value === id) {
                return modules;
            }
            const items = {...modules[module][type]};
            items[value] = items[id];
            items[value].id = value;
            delete items[id];
            return {
                ...modules,
                [module]: {
                    ...modules[module],
                    [type]: items,
                },
            };
        } else {
            const items = {...modules[module][type]};

            const path = key.split(".");

            let current = items[id];
            while (path.length > 1) {
                const segment = path.shift();
                if (!current[segment]) {
                    if (typeof current === "object") {
                        current[segment] = {};
                        current = current[segment];
                    } else {
                        console.error(`Cannot find ${key}`, path, JSON.stringify(current));
                    }
                    break;
                } else {
                    current = current[segment];
                }
            }

            if (path.length > 1) {
                // didn't find it. No change
                return modules;
            }

            if (value === null) {
                if (Array.isArray(current)) {
                    current.splice(path[0], 1);
                } else {
                    delete current[path[0]];
                }
            } else {
                if (NUMERIC_ENTITY_FILEDS.includes(path[0])) {
                    value = parseInt(value, 10);
                }
                current[path[0]] = value;
            }

            return {
                ...modules,
                [module]: {
                    ...modules[module],
                    [type]: items,
                },
            };
        }
    }
 
    const value = {
        loadModules: (names) => {
            if (!names) {
                return;
            }
            setLoaded(false);

            const promises = names.map(async (name) => {
                const result = await Coms.send('getModule', { name });

                if (!result.success) {
                    console.error(result.message);
                    return;
                }

                const module = result.module;

                for (const image in module.images) {
                    const tileData = module.images[image];
                    const imageId = loadImage(tileData);

                    module.images[image] = {
                        id: imageId,
                    };
                }

                for (const sound in module.sounds) {
                    const soundData = module.images[sound];
                    const soundId = loadSound(soundData);

                    module.sounds[sound] = {
                        id: soundId,
                    };
                }

                setModule(name, module);
                render();
            });

            Promise.all(promises).then(() => {
                setLoaded(true);
            });
        },
        getImage: (image) => {
            const images = getImages();
            if (!images[image]) {
                return null;
            }

            const imageId = images[image].id;

            return loadedImages[imageId];
        },
        loaded,
        tiles: getTiles(),
        objects: getObjects(),
        characters: getCharacters(),
        scripts: getScripts(),
        enemies: getEnemies(),
        equipment: getEquipment(),
        modulesList: Object.keys(modules),
        getLoadedModules: () => {
            return Object.keys(modules);
        },
        getSaveData: () => {
            return Object.keys(modules).reduce((obj, key) => {
                const module = modules[key];
                const newModule = {
                    ...module,
                    tiles: Object.keys(module.tiles).reduce((obj, key) => {
                        const tile = {...module.tiles[key]};
                        delete tile.image;
                        tile.image = tile.rawImage;
                        delete tile.rawImage;
                        return {
                            ...obj,
                            [key]: tile,
                        };
                    }, {}),
                };

                delete newModule.images;
                
                return {
                    ...obj,
                    [key]: newModule,
                };
            }, {});
        },
        createNewModule: (module) => {
            setModule(module, {
                tiles: {},
                objects: {},
                characters: {},
                enemies: {},
                images: {},
                scripts: {},
                equipment: {},
            });
            setLoaded(true);
        },
        changeTile: (module, id, key, value) => {
            if (key === "id") {
                if (value === id) {
                    return;
                }
                const moduleData = getModule(module);
                moduleData.tiles[value] = moduleData.tiles[id];
                delete moduleData.tiles[id];
                setModule(module, moduleData);
            } else {
                const moduleData = getModule(module);
                moduleData.tiles[id][key] = value;
                setModule(module, moduleData);
            }
            render();
        },
        changeCharacter: (module, id, key, value) => {
            const modules = getModules();
            setModule(
                module,
                updateEntity(modules, module, "characters", id, key, value)[module],
            );
            render();
        },
        changeObject: (module, id, key, value) => {
            const modules = getModules();
            setModule(
                module,
                updateEntity(modules, module, "objects", id, key, value)[module],
            );
            render();
        },
        changeEnemy: (module, id, key, value) => {
            const modules = getModules();
            setModule(
                module,
                updateEntity(modules, module, "enemies", id, key, value)[module],
            );
            render();
        },
        addTile: (module) => {
            const moduleData = getModule(module);
            moduleData.tiles[''] = {
                rawImage: '',
                type: TILE_TYPE.GROUND,
            };
            setModule(module, moduleData);
            render();
        },
        addCharacter: (module, name) => {
            const moduleData = getModule(module);
            if (moduleData.characters[name]) {
                return;
            }
            const nameWithoutModule = name.replace(module + "_", "");
            moduleData.characters[name] = {
                version: 2,
                id: name,
                manifest: {
                    manifest: "characters/" + nameWithoutModule + ".json",
                    original: "characters/" + nameWithoutModule + ".json",
                },
                scripts: {},
                images: {},
                slots: [],
            };
            setModule(module, moduleData);
            render();
        },
        addEnemy: (module, name) => {
            const moduleData = getModule(module);
            if (moduleData.enemies[name]) {
                return;
            }
            moduleData.enemies[name] = {
                version: 2,
                id: name,
                manifest: {
                    manifest: "enemies/" + name + ".json",
                    original: "enemies/" + name + ".json",
                },
                scripts: {},
                images: {},
            };
            setModule(module, moduleData);
            render();
        },
        addObject: (module, name) => {
            const moduleData = getModule(module);
            if (moduleData.objects[name]) {
                return;
            }
            moduleData.objects[name] = {
                version: 2,
                id: name,
                manifest: {
                    manifest: "objects/" + name + ".json",
                    original: "objects/" + name + ".json",
                },
                scripts: {},
                images: {},
            };
            setModule(module, moduleData);
            render();
        },
        addEquipment: (module, name) => {
            name = name.replaceAll(" ", "_");
            const moduleData = getModule(module);
            if (!moduleData.equipment) {
                moduleData.equipment = {};
            }
            if (moduleData.equipment[name]) {
                return;
            }
            moduleData.equipment[name] = {
                version: 2,
                id: name,
                name: '',
                type: '',
                manifest: {
                    manifest: "equipment/" + name + ".json",
                    original: "equipment/" + name + ".json",
                },
                mainImage: '',
                stats: [],
            };
            setModule(module, moduleData);
            render();
        },
        changeEquipment: (module, id, key, value) => {
            const modules = getModules();
            setModule(
                module,
                updateEntity(modules, module, "equipment", id, key, value)[module],
            );
            render();
        },
        updateScript: (module, id, code) => {
            const moduleData = getModule(module);
            moduleData.scripts[id] = code;
            setModule(module, moduleData);
            render();
        },
        addScript: (module, name) => {
            const moduleData = getModule(module);
            moduleData.scripts[name] = "";
            setModule(module, moduleData);
            render();
        },
    };

    return (
        <ModuleContext.Provider value={value}>
            {children}
        </ModuleContext.Provider>
    );
}