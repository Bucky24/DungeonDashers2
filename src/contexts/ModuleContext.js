import React, { useContext, useEffect, useState } from 'react';

import Coms from '../utils/coms';
import ImageContext from './ImageContext';
import { TILE_TYPE } from './MapContext';

export const BASE_STATES = {
    LEFT: 'base_left',
    RIGHT: 'base_right',
    UP: 'base_up',
    DOWN: 'base_down',
};

const ModuleContext = React.createContext({});
export default ModuleContext;

export function ModuleProvider({ children }) {
    const [loaded, setLoaded] = useState(false);
    const { loadImage, images: loadedImages } = useContext(ImageContext);
    const [modules, setModules] = useState({});
    const [tiles, setTiles] = useState({});
    const [images, setImages] = useState({});
    const [objects, setObjects] = useState({});
    const [characters, setCharacters] = useState({});
    const [scripts, setScripts] = useState({});
    const [enemies, setEnemies] = useState({});

    useEffect(() => {
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

        setTiles(allTiles);
        setImages(allImages);
        setObjects(allObjects);
        setCharacters(allCharacters);
        setScripts(allScripts);
        setEnemies(allEnemies);
    }, [modules]);

    const updateEntity = (modules, module, type, id, key, value) => {
        if (key === "id") {
            // prevent actually deleting the tile if it's the same
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

                //console.log(module);
                for (const image in module.images) {
                    const tileData = module.images[image];
                    const imageId = loadImage(tileData);

                    module.images[image] = {
                        id: imageId,
                    };
                }

                setModules((modules) => {
                    return {
                        ...modules,
                        [name]: module,
                    };
                });
            });

            Promise.all(promises).then(() => {
                setLoaded(true);
            });
        },
        getImage: (image) => {
            if (!images[image]) {
                return null;
            }

            const imageId = images[image].id;

            return loadedImages[imageId];
        },
        loaded,
        tiles,
        objects,
        characters,
        scripts,
        enemies,
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
                delete newModule.scripts;
                
                return {
                    ...obj,
                    [key]: newModule,
                };
            }, {});
        },
        changeTile: (module, id, key, value) => {
            if (key === "id") {
                if (value === id) {
                    return;
                }
                setModules((modules) => {
                    const tiles = {...modules[module].tiles};
                    tiles[value] = tiles[id];
                    delete tiles[id];
                    return {
                        ...modules,
                        [module]: {
                            ...modules[module],
                            tiles,
                        },
                    };
                });
            } else {
                setModules((modules) => {
                    return {
                        ...modules,
                        [module]: {
                            ...modules[module],
                            tiles: {
                                ...modules[module].tiles,
                                [id]: {
                                    ...modules[module].tiles[id],
                                    [key]: value,
                                },
                            },
                        },
                    };
                });
            }
        },
        changeObject: (module, id, key, value) => {
            setModules((modules) => {
                return updateEntity(modules, module, "objects", id, key, value);
            });
        },
        changeEnemy: (module, id, key, value) => {
            setModules((modules) => {
                return updateEntity(modules, module, "enemies", id, key, value);
            });
        },
        addTile: (module) => {
            setModules((modules) => {
                const tiles = {...modules[module].tiles};
                tiles[''] = {
                    rawImage: '',
                    type: TILE_TYPE.GROUND,
                };
                return {
                    ...modules,
                    [module]: {
                        ...modules[module],
                        tiles,
                    },
                };
            });
        },
        addEnemy: (module, name) => {
            setModules((modules) => {
                const enemies = {...modules[module].enemies};
                if (enemies[name]) {
                    return enemies;
                }
                enemies[name] = {
                    version: 2,
                    id: name,
                    manifest: {
                        manifest: "enemies/" + name + ".json",
                        original: "enemies/" + name + ".json",
                    },
                    scripts: {},
                };
                return {
                    ...modules,
                    [module]: {
                        ...modules[module],
                        enemies,
                    },
                };
            });
        },
        addObject: (module, name) => {
            setModules((modules) => {
                const entities = {...modules[module].objects};
                if (entities[name]) {
                    return entities;
                }
                entities[name] = {
                    version: 2,
                    id: name,
                    manifest: {
                        manifest: "objects/" + name + ".json",
                        original: "objects/" + name + ".json",
                    },
                    scripts: {},
                };

                return {
                    ...modules,
                    [module]: {
                        ...modules[module],
                        objects: entities,
                    },
                };
            });
        }
    };

    return (
        <ModuleContext.Provider value={value}>
            {children}
        </ModuleContext.Provider>
    );
}