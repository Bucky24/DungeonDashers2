import React, { useContext, useState } from 'react';

import Coms from '../utils/coms';
import MapContext from './MapContext';

const EditorContext = React.createContext({});
export default EditorContext;

export function EditorProvider({ children}) {
    const { loadMap, getSaveData: getMapSaveData } = useContext(MapContext);
    
    const [loaded, setLoaded] = useState(true);
    const [map, setMap] = useState(null);
    const [saving, setSaving] = useState(false);

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
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}