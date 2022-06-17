import React, { useContext, useState } from 'react';

import Coms from '../utils/coms';
import MapContext from './MapContext';
import ModuleContext from './ModuleContext';

const EditorContext = React.createContext({});
export default EditorContext;

export function EditorProvider({ children}) {
    const { loadMap, getSaveData: getMapSaveData } = useContext(MapContext);
    const { loadModules } = useContext(ModuleContext);

    const [loaded, setLoaded] = useState(true);
    const [map, setMap] = useState(null);
    const [saving, setSaving] = useState(false);
    const [module, setModule] = useState(null);

    const value = {
        loaded,
        loadMap: async (map) => {
            setLoaded(true);
            setMap(map);

            loadMap(map, true);
        },
        saveMap: () => {
            setSaving(true);
            const mapData = getMapSaveData();

            Coms.send("saveMap", { name: map, data: mapData }).then((result) => {
                setSaving(false);
                if (!result.success) {
                    console.error(result.message);
                    return;
                }
            });
        },
        loadModule: async (module) => {
            setLoaded(true);
            setModule(module);

            loadModules([module]);
        },
        module,
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}