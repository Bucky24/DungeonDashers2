import React, { useContext, useEffect, useState } from 'react';

import Coms from '../utils/coms';
import ImageContext from './ImageContext';

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
        getSaveData: () => {
            return Object.keys(modules);
        },
    };

    return (
        <ModuleContext.Provider value={value}>
            {children}
        </ModuleContext.Provider>
    );
}