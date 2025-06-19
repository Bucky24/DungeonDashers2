import React, { useContext, useState } from 'react';

import Coms from '../utils/coms';
import MapContext from './MapContext';
import ModuleContext from './ModuleContext';

const EditorContext = React.createContext({});
export default EditorContext;

export const EDITOR_MAP_TOOLS = {
    MOVE: 'map_tools/move',
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
    const {
        loadMap,
        getSaveData:
        getMapSaveData,
        createNewMap,
        setTile,
        updateEnemy,
        updateObject,
        getAtPosition,
        placeCharacter,
    } = useContext(MapContext);
    const { loadModules, getSaveData: getModuleSaveData, createNewModule } = useContext(ModuleContext);

    const [loaded, setLoaded] = useState(false);
    const [map, setMap] = useState(null);
    const [saving, setSaving] = useState(false);
    const [module, setModule] = useState(null);
    const [hoveredEntities, setHoveredEntities] = useState([]);
    const [activeItem, setActiveItem] = useState('');
    const [tool, setTool] = useState(EDITOR_MAP_TOOLS.MOVE);
    const [selectedCells, setSelectedCells] = useState([]);
    const [removeUnder, setRemoveUnder] = useState(true);
    const [selectStart, setSelectStart] = useState(null);

    const value = {
        loaded,
        map,
        selectedCells,
        setSelectedCells,
        removeUnder,
        setRemoveUnder,
        selectStart,
        setSelectStart,
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
                loadModules(Object.keys(moduleData));
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
        setTile: (x, y, tile) => {
            if (tool === EDITOR_MAP_TOOLS.PLACE_TILE) {
                setTile(x, y, tile, removeUnder);
            } else {
                setTile(x, y, null);
            }
        },
        moveSelection: (xOff, yOff) => {
            // we need to move everything by the given offset
            const previousTiles = [];
            for (const cell of selectedCells) {
                const { tiles, characters, enemies, objects } = getAtPosition(cell.x, cell.y);

                for (const character of characters) {
                    placeCharacter(character.x + xOff, character.y + yOff, character.type);
                }

                for (const enemy of enemies) {
                    updateEnemy(enemy.id, 'x', enemy.x + xOff);
                    updateEnemy(enemy.id, 'y', enemy.y + yOff);
                }

                for (const object of objects) {
                    updateObject(object.id, 'x', object.x + xOff);
                    updateObject(object.id, 'y', object.y + yOff);
                }

                previousTiles.push(...tiles);
            }

            // using previousTiles since this operation might overwrite tiles that we have yet to 
            // process, previousTiles has a backup of those tiles so we can still run over them.
            // also why we do this in two steps, otherwise the null can overwrite the previous actions
            // if we go in some directions
            for (const tile of previousTiles) {
                setTile(tile.x, tile.y, null);
            }
            for (const tile of previousTiles) {
                setTile(tile.x + xOff, tile.y + yOff, tile.tile, false);
            }
        },
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}