import React, { useContext, useEffect, useState } from 'react';

import Coms from '../utils/coms';
import ImageContext from './ImageContext';
import { TILE_TYPE } from './MapContext';

const ModuleContext = React.createContext({});
export default ModuleContext;

export function ModuleProvider({ children }) {
    const [loaded, setLoaded] = useState(false);
    const { loadImage } = useContext(ImageContext);
    const [modules, setModules] = useState({});
    const [tiles, setTiles] = useState({});

    useEffect(() => {
        const allTiles = {};
        for (const module in modules) {
            const moduleData = modules[module];

            for (const tileId in moduleData.tiles) {
                const tile = moduleData.tiles[tileId];

                const fullId = `${module}_${tileId}`;

                allTiles[fullId] = tile;
            }
        }

        setTiles(allTiles);
    }, [modules]);

    const value = {
        loadModules: (names) => {
            setLoaded(false);

            const promises = names.map(async (name) => {
                const result = await Coms.send('getModule', { name });

                if (!result.success) {
                    console.error(result.message);
                    return;
                }

                const module = result.module;

                //console.log(module);
                for (const tile in module.tiles) {
                    const tileData = module.tiles[tile];
                    const imageId = loadImage(tileData.image);
                    tileData.image = imageId;
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
        loaded,
        tiles,
        modulesList: Object.keys(modules),
        getLoadedModules: () => {
            return Object.keys(modules);
        },
        getSaveData: () => {
            return Object.keys(modules).reduce((obj, key) => {
                const module = modules[key];
                return {
                    ...obj,
                    [key]: {
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
                    }
                }
            }, {});
        },
        changeTile: (module, id, key, value) => {
            if (key === "id") {
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