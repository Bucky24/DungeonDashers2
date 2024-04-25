import React, { useContext, useState } from 'react';

import Coms from '../utils/coms';
import MapContext from './MapContext';
import ModuleContext from './ModuleContext';

const EditorContext = React.createContext({});
export default EditorContext;

export const EDITOR_MAP_TOOLS = {
    SELECT: 'map_tools/select',
    PLACE_TILE: 'map_tools/place_tile',
    PLACE_OBJECT: 'map_tools/place_object',
    PLACE_CHARACTER: 'map_tools/place_character',
    PLACE_ENEMY: 'map_tools/place_enemy',
    REMOVE_TIILE: 'map_tools/remove_tile',
    REMOVE_ENTITY: 'map_tools/remove_entity',
    REMOVE_ALL: 'map_tools/remove_all',
};

export function EditorProvider({ children}) {
    const { loadMap, getSaveData: getMapSaveData, createNewMap } = useContext(MapContext);
    const { loadModules, getSaveData: getModuleSaveData, createNewModule } = useContext(ModuleContext);

    const [loaded, setLoaded] = useState(false);
    const [map, setMap] = useState(null);
    const [saving, setSaving] = useState(false);
    const [module, setModule] = useState(null);
    const [hoveredEntities, setHoveredEntities] = useState([]);
    const [activeItem, setActiveItem] = useState('');
    const [tool, setTool] = useState('');

    const value = {
        loaded,
        map,
        loadMap: async (map) => {
            setLoaded(true);
            setMap(map);

            loadMap(map, true);
        },
        createNewMap: (name) => {
            createNewMap(name);
            setLoaded(true);
            setMap(name);
        },
        saveMap: () => {
            setSaving(true);
            const mapData = getMapSaveData();

            return Coms.send("saveMap", { name: map, data: mapData }).then((result) => {
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
        createNewModule: async (module) => {
            createNewModule(module);
            setModule(module);
            setLoaded(true);
        },
        module,
        hoveredEntities,
        setHoveredEntities,
        activeItem,
        setActiveItem,
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