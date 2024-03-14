import React, { useState, useContext } from 'react';

import Coms from '../utils/coms';
import ModuleContext from './ModuleContext';

const MapContext = React.createContext({});
export default MapContext;

export const TILE_TYPE = {
    GROUND: 'ground',
    WALL: 'wall',
    HOLE: 'hole',
};

export const BASE_STATES = {
    RIGHT: 'base_right',
    LEFT: 'base_left',
    UP: 'base_up',
    DOWN: 'base_down',
    DEAD: 'base_dead',
};

export function MapProvider({ children }) {
    const [map, setMap] = useState([]);
    // this should move to game context eventually
    const [objects, setObjects] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const { loadModules, getLoadedModules } = useContext(ModuleContext);
    const [editable, setEditable] = useState(false);

    const value = {
        loaded,
        map,
        objects,
        characters,
        loadMap: async (map, editable) => {
            setEditable(editable);
            const result = await Coms.send("getMap", { name: map });
            if (!result.success) {
                console.error(result.message);
                return;
            }

            const modules = result.map.modules;
            loadModules(modules);
            setMap(result.map.map || []);
            setObjects(result.map.objects || []);
            setCharacters(result.map.characters || []);

            setLoaded(true);
            
            return {
                objects: result.map.objects || [],
                characters: result.map.characters || [],
            };
        },
        editable,
        // change the tile at x, y. Pass null as tile to remove
        setTile: (x, y, tile) => {
            if (!editable) {
                console.error("setTile called but map is set to not be editable");
                return;
            }

            const existingIndex = map.findIndex((tile) => {
                return tile.x === x && tile.y === y;
            });

            if (existingIndex > -1) {
                if (tile === null) {
                    map.splice(existingIndex, 1);
                } else {
                    map[existingIndex].tile = tile;
                }
            } else {
                if (tile !== null) {
                    map.push({
                        x,
                        y,
                        tile,
                    });
                }
            }

            setMap([
                ...map,
            ]);
        },
        getSaveData: () => {
            const modules = getLoadedModules();

            const mapData = {
                version: 2,
                modules,
                map,
                objects,
                characters,
            };

            return mapData;
        }
    };

    return (
        <MapContext.Provider value={value}>
            {children}
        </MapContext.Provider>
    );
}