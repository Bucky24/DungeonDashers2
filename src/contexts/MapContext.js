import React, { useState, useContext } from 'react';

import Coms from '../utils/coms';
import ModuleContext from './ModuleContext';

const MapContext = React.createContext({});
export default MapContext;

export function MapProvider({ children }) {
    const [map, setMap] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const { loadModules } = useContext(ModuleContext);

    const value = {
        loaded,
        map,
        loadMap: async (map) => {
            Coms.send("getMap", { name: map }).then((result) => {
                if (!result.success) {
                    console.error(result.message);
                    return;
                }

                const modules = result.map.modules;
                loadModules(modules);
                setMap(result.map.map || []);

                setLoaded(true);
            });
        },
    };

    return (
        <MapContext.Provider value={value}>
            {children}
        </MapContext.Provider>
    );
}