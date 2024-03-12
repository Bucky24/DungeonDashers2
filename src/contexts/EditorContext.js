import React, { useContext, useState } from 'react';

import Coms from '../utils/coms';
import MapContext from './MapContext';
import ModuleContext from './ModuleContext';

const EditorContext = React.createContext({});
export default EditorContext;

export const EDITOR_MAP_TOOLS = {
    PLACE_TILE: 'map_tools/place_tile',
    PLACE_OBJECT: 'map_tools/place_object',
    REMOVE_TIILE: 'map_tools/remove_tile',
    REMOVE_OBJECT: 'map_tools/remove_object',
    REMOVE_ALL: 'map_tools/remove_all',
};

export function EditorProvider({ children}) {
    const { loadMap, getSaveData: getMapSaveData } = useContext(MapContext);
    const { loadModules, getSaveData: getModuleSaveData } = useContext(ModuleContext);

    const [loaded, setLoaded] = useState(true);
    const [map, setMap] = useState(null);
    const [saving, setSaving] = useState(false);
    const [module, setModule] = useState(null);
    const [hoveredEntities, setHoveredEntities] = useState([]);
    const [activeTile, setActiveTile] = useState('');
    const [tool, setTool] = useState('');

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
        saveModules: () => {
            setSaving(true);
            const moduleData = getModuleSaveData();

            const promises = Object.keys(moduleData).map((key) => {
                return new Promise((resolve) => {
                    Coms.send("saveModule", { name: key, data: moduleData[key] }).then((result) => {
                        if (!result.success) {
                            console.error(result.message);
                            return;
                        }

                        resolve();
                    });
                });
            });

            Promise.all(promises).then(() => {
                setSaving(false);
            });
        },
        loadModule: async (module) => {
            setLoaded(true);
            setModule(module);

            loadModules([module]);
        },
        module,
        hoveredEntities,
        setHoveredEntities,
        activeTile,
        setActiveTile,
        saving,
        setTool,
        tool,
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}