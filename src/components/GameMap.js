import React, { useContext } from 'react';

import TheMap from './TheMap';
import MapContext from '../contexts/MapContext';
import { useHandleKeyboard } from '../utils/handleInput';
import GameContext from '../contexts/GameContext';
import UIContext, { UI_MODE } from '../contexts/UIContext';

export default function GameMap() {
    const { map } = useContext(MapContext);
    const { objects, characters, activeCharacterIndex } = useContext(GameContext);
    const { mode, cellSelectData, markCellSelected, acceptSelectedCell } = useContext(UIContext);
    const handleKeyboard = useHandleKeyboard();

    return (
        <TheMap
            map={map}
            objects={objects}
            zoomLocked={true}
            zoom={200}
            characters={characters}
            onKey={(code) => {
                if (mode === UI_MODE.GAME) {
                    handleKeyboard(code);
                } else if (mode === UI_MODE.CELL_SELECT) {
                    if (code === "ArrowLeft") {
                        let leftMost = null;
                        for (const cell of cellSelectData.cells) {
                            if (!leftMost || cell.x < leftMost.x) {
                                leftMost = cell;
                            }
                        }
                        if (leftMost) {
                            markCellSelected(leftMost);
                        }
                    } else if (code === "ArrowRight") {
                        let foundCell = null;
                        for (const cell of cellSelectData.cells) {
                            if (!foundCell || cell.x > foundCell.x) {
                                foundCell = cell;
                            }
                        }
                        if (foundCell) {
                            markCellSelected(foundCell);
                        }
                    } else if (code === "ArrowUp") {
                        let foundCell = null;
                        for (const cell of cellSelectData.cells) {
                            if (!foundCell || cell.y < foundCell.y) {
                                foundCell = cell;
                            }
                        }
                        if (foundCell) {
                            markCellSelected(foundCell);
                        }
                    } else if (code === "ArrowDown") {
                        let foundCell = null;
                        for (const cell of cellSelectData.cells) {
                            if (!foundCell || cell.y > foundCell.y) {
                                foundCell = cell;
                            }
                        }
                        if (foundCell) {
                            markCellSelected(foundCell);
                        }
                    } else if (code === "Enter") {
                        acceptSelectedCell();
                    }
                }
            }}
            moveLocked={true}
            xOff={100}
            yOff={100}
            centerX={characters[activeCharacterIndex].x}
            centerY={characters[activeCharacterIndex].y}
            selectionRectangles={mode === UI_MODE.CELL_SELECT ? cellSelectData.cells : null}
            selectedRectangle={mode === UI_MODE.CELL_SELECT ? cellSelectData.selected : null}
        />
    );
}