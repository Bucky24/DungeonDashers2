import React, { useContext } from 'react';
import { ButtonTypes } from '@bucky24/react-canvas';

import TheMap from './TheMap';
import MapContext from '../contexts/MapContext';
import EditorContext, { EDITOR_MAP_TOOLS} from '../contexts/EditorContext';

export default function EditorMap() {
    const {
        map,
        objects,
        characters,
        enemies,
        createObject,
        placeCharacter,
        createEnemy,
        removeEntities,
    } = useContext(MapContext);
    const {
        setHoveredEntities,
        activeItem,
        tool,
        setSelectedCells,
        setTile,
        setSelectStart,
        selectStart,
    } = useContext(EditorContext);

    return (
        <TheMap
            map={map}
            objects={objects}
            characters={characters}
            enemies={enemies}
            showInactive={true}
            heightOffset={60}
            fullFocus={false}
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
                            placeCharacter(cellX, cellY, activeItem);
                        }
                    } else if (tool === EDITOR_MAP_TOOLS.PLACE_ENEMY) {
                        if (activeItem && activeItem !== "") {
                            createEnemy(cellX, cellY, activeItem);
                        }
                    } else if (tool === EDITOR_MAP_TOOLS.REMOVE_TIILE || tool === EDITOR_MAP_TOOLS.REMOVE_ALL) {
                        setTile(cellX, cellY, null);
                    } else if (tool === EDITOR_MAP_TOOLS.REMOVE_ENTITY) {
                        removeEntities(cellX, cellY);
                    } else if (tool === EDITOR_MAP_TOOLS.SELECT) {
                        setSelectedCells([{ x: cellX, y: cellY }]);
                    }
                } else if (button === ButtonTypes.RIGHT) {
                    if (tool === EDITOR_MAP_TOOLS.PLACE_TILE) {
                        setTile(cellX, cellY, null);
                    }
                }

                setSelectStart(null);
            }}
            onHover={(entities) => {
                setHoveredEntities(entities);
            }}
            showInvalidEntities={true}
            moveLocked={tool === EDITOR_MAP_TOOLS.SELECT}
            onPress={(x, y, button) => {
                if (button === ButtonTypes.LEFT) {
                    if (tool === EDITOR_MAP_TOOLS.SELECT) {
                        setSelectStart({ x, y });
                    }
                }
            }}
            onRelease={(x, y, button) => {
                setSelectStart(null);
                if (!selectStart || (selectStart.x === x && selectStart.y === y)) {
                    return;
                }
                if (button === ButtonTypes.LEFT) {
                    if (tool === EDITOR_MAP_TOOLS.SELECT) {
                        // figure out all entries in between the two points
                        // and select them all
                        const minX = Math.min(x, selectStart.x);
                        const minY = Math.min(y, selectStart.y);
                        const maxX = Math.max(x, selectStart.x);
                        const maxY = Math.max(y, selectStart.y);

                        const selectedCells = [];
                        for (let i=minX;i<=maxX;i++) {
                            for (let j=minY;j<maxY;j++) {
                                selectedCells.push({ x: i, y: j });
                            }
                        }

                        setSelectedCells(selectedCells);
                    }
                }
            }}
        />
    );
}