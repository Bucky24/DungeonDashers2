import React, { useState, useContext } from 'react';

import Coms from '../utils/coms';
import ModuleContext from './ModuleContext';
import { setMap as setMapData } from '../data/mapData';

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
    const [triggers, setTriggers] = useState({});
    const [enemies, setEnemies] = useState([]);
    const [mapName, setMapName] = useState("");

    const value = {
        loaded,
        map,
        objects,
        characters,
        triggers,
        enemies,
        mapName,
        loadMap: async (map, editable) => {
            setEditable(editable);
            setMapName(map);
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
            setEnemies(result.map.enemies || []);

            setTriggers(result.map.triggers || {});

            setLoaded(true);

            setMapData({
                tiles: result.map.map || [],
            });
            
            return {
                objects: result.map.objects || [],
                characters: result.map.characters || [],
                enemies: result.map.enemies || [],
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
        getTile: (x, y) => {
            const existing = map.find((tile) => {
                return tile.x === x && tile.y === y;
            });

            return existing;
        },
        getSaveData: () => {
            const modules = getLoadedModules();

            const mapData = {
                version: 2,
                modules,
                map,
                characters,
                objects,
                enemies,
                triggers,
            };

            return mapData;
        },
        updateTriggerEffect: (id, index, obj) => {
            setTriggers((triggers) => {
                if (!triggers[id]) {
                    console.error(`No map trigger found with id ${id}`);
                    return triggers;
                }
                const thisTrigger = {...triggers[id]};
                thisTrigger.effects[index] = obj;
                return {
                    ...triggers,
                    [id]: thisTrigger,
                };
            });
        },
        createTrigger: (id) => {
            setTriggers((triggers) => {
                if (triggers[id]) {
                    return triggers;
                }
                return {
                    ...triggers,
                    [id]: {
                        effects: [],
                    },
                };
            });
        },
        createEffect: (id, effectObj) => {
            setTriggers((triggers) => {
                if (!triggers[id]) {
                    console.error(`No map trigger found with id ${id}`);
                    return triggers;
                }
                const thisTrigger = {...triggers[id]};
                thisTrigger.effects.push(effectObj);
                return {
                    ...triggers,
                    [id]: thisTrigger,
                };
            });
        },
        createObject: (x, y, type) => {
            setObjects((entities) => {
                let highestId = 0;
                for (const entity of entities) {
                    if (!entity.id) continue;
                    highestId = Math.max(highestId, entity.id);
                }
                const newEntities = [...entities];
                newEntities.push({
                    type,
                    x,
                    y,
                    id: highestId + 1,
                });

                return newEntities;
            });
        },
        updateObject: (id, key, value) => {
            setObjects((entities) => {
                const newEntities = entities.map((entity) => {
                    if (entity.id === id) {
                        return {
                           ...entity,
                            [key]: value,
                        };   
                    }
                    return entity;
                });

                return newEntities;
            });
        },
        placeCharacter: (x, y, type) => {
            setCharacters((entities) => {
                const newEntities = [...entities].filter((entity) => entity.type !== type);
                newEntities.push({
                    type,
                    x,
                    y,
                });

                return newEntities;
            });
        },
        removeEntities: (x, y) => {
            setCharacters((entities) => {
                const newEntities = entities.filter((entity) => {
                    return entity.x!== x || entity.y!== y;
                });

                return newEntities;
            });

            setEnemies((entities) => {
                const newEntities = entities.filter((entity) => {
                    return entity.x!== x || entity.y!== y;
                });

                return newEntities;
            });

            setObjects((entities) => {
                const newEntities = entities.filter((entity) => {
                    return entity.x!== x || entity.y!== y;
                });

                return newEntities;
            });
        },
        createEnemy: (x, y, type) => {
            setEnemies((entities) => {
                const newEntities = [...entities];
                newEntities.push({
                    type,
                    x,
                    y,
                });

                return newEntities;
            });
        },
        createNewMap: (name) => {
            setEditable(true);
            setMapName(name);
            setEnemies([]);
            setMap([]);
            setCharacters([]);
            setObjects([]);
            setTriggers({});
            setLoaded(true);
            
            loadModules(['main']);
        },
        // NOTE should be used for editor only. When in game, use
        // getEntitiesAtPosition in the GameContext
        entitiesAtPosition: (x, y) => {
            const result = [];
            for (const entity of objects) {
                if (entity.x ===x && entity.y === y) {
                    result.push({
                        type: 'object',
                        entity,
                    });
                }
            }

            for (const entity of characters) {
                if (entity.x === x && entity.y === y) {
                    result.push({
                        type: 'character',
                        entity,
                    });
                }
            }

            for (const entity of enemies) {
                if (entity.x === x && entity.y === y) {
                    result.push({
                        type: 'enemy',
                        entity,
                    });
                }
            }

            return result;
        },
    };

    return (
        <MapContext.Provider value={value}>
            {children}
        </MapContext.Provider>
    );
}