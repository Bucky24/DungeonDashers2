import React, { useContext } from 'react';
import { ButtonTypes } from '@bucky24/react-canvas';

import TheMap from './TheMap';
import MapContext from '../contexts/MapContext';
import EditorContext, { EDITOR_MAP_TOOLS} from '../contexts/EditorContext';

export default function EditorMap() {
    const {
        map,
        setTile,
        objects,
        characters,
        enemies,
        createObject,
        createCharacter,
        createEnemy,
    } = useContext(MapContext);
    const {
        setHoveredEntities,
        activeItem,
        tool,
    } = useContext(EditorContext);

    return (
        <TheMap
            map={map}
            objects={objects}
            characters={characters}
            enemies={enemies}
            onClick={(cellX, cellY, button) => {
                //console.log(cellX, cellY, button);
                if (button === ButtonTypes.LEFT) {
                    if (tool === EDITOR_MAP_TOOLS.PLACE_TILE) {
                        if (activeItem && activeItem !== "") {
                            setTile(cellX, cellY, activeItem);
                        }
                    } else if (tool === EDITOR_MAP_TOOLS.PLACE_OBJECT) {
                        if (activeItem && activeItem !== "") {
                            createObject(cellX, cellY, activeItem);
                        }
                    } else if (tool === EDITOR_MAP_TOOLS.PLACE_CHARACTER) {
                        if (activeItem && activeItem !== "") {
                            createCharacter(cellX, cellY, activeItem);
                        }
                    } else if (tool === EDITOR_MAP_TOOLS.PLACE_ENEMY) {
                        if (activeItem && activeItem !== "") {
                            createEnemy(cellX, cellY, activeItem);
                        }
                    } else if (tool === EDITOR_MAP_TOOLS.REMOVE_TIILE || tool === EDITOR_MAP_TOOLS.REMOVE_ALL) {
                        setTile(cellX, cellY, null);
                    }
                } else if (button === ButtonTypes.RIGHT) {
                    setTile(cellX, cellY, null);
                }
            }}
            onHover={(entities) => {
                setHoveredEntities(entities);
            }}
            showInvalidEntities={true}
        />
    );
}