import React, { useContext, useEffect, useState } from 'react';

import Coms from '../utils/coms';
import ImageContext from './ImageContext';
import { TILE_TYPE } from './MapContext';

const ModuleContext = React.createContext({});
export default ModuleContext;

export function ModuleProvider({ children }) {
    const [loaded, setLoaded] = useState(false);
    const { loadImage, images: loadedImages } = useContext(ImageContext);
    const [modules, setModules] = useState({});
    const [tiles, setTiles] = useState({});
    const [images, setImages] = useState({});
    const [objects, setObjects] = useState({});

    useEffect(() => {
        const allTiles = {};
        const allImages = {};
        const allObjects = {};
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
        }

        setTiles(allTiles);
        setImages(allImages);
        setObjects(allObjects);
    }, [modules]);

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
                // prevent actually deleting the tile if it's the same
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
            if (key === "id") {
                // prevent actually deleting the tile if it's the same
                if (value === id) {
                    return;
                }
                setModules((modules) => {
                    const items = {...modules[module].objects};
                    items[value] = items[id];
                    items[value].id = value;
                    delete items[id];
                    return {
                        ...modules,
                        [module]: {
                            ...modules[module],
                            objects: items,
                        },
                    };
                });
            } else {
                setModules((modules) => {
                    const items = {...modules[module].objects};

                    const path = key.split(".");

                    let current = items[id];
                    while (path.length > 1) {
                        const segment = path.shift();
                        if (!current[segment]) {
                            console.error(`Cannot find ${key}`, path, current);
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
                            objects: items,
                        },
                    };
                });
            }
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
    };

    return (
        <ModuleContext.Provider value={value}>
            {children}
        </ModuleContext.Provider>
    );
}