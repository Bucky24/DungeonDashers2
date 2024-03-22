import React, { useContext } from 'react';

import styles from './GameMap.css';

import TheMap from './TheMap';
import MapContext from '../contexts/MapContext';
import { useHandleKeyboard } from '../utils/handleInput';
import GameContext from '../contexts/GameContext';
import UIContext, { UI_MODE } from '../contexts/UIContext';

export default function GameMap() {
    const { map } = useContext(MapContext);
    const {
        objects,
        characters,
        enemies,
        activeCharacterIndex,
        paused,
        cameraCenterPos,
    } = useContext(GameContext);
    const {
        mode,
        cellSelectData,
        markCellSelected,
        acceptSelectedCell,
        dialog,
        clearDialog,
    } = useContext(UIContext);
    const handleKeyboard = useHandleKeyboard();

    return (<>
        <TheMap
            map={map}
            objects={objects}
            zoomLocked={true}
            zoom={200}
            characters={characters}
            enemies={enemies}
            onKey={(code) => {
                if (paused) {
                    return;
                }
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
            centerX={cameraCenterPos?.x || characters[activeCharacterIndex].x}
            centerY={cameraCenterPos?.y || characters[activeCharacterIndex].y}
            selectionRectangles={mode === UI_MODE.CELL_SELECT ? cellSelectData.cells : null}
            selectedRectangle={mode === UI_MODE.CELL_SELECT ? cellSelectData.selected : null}
        />
        {dialog && <div className={styles.dialog_outer}>
            <div className={styles.dialog_inner}>
                <div>{dialog.dialog}</div>
                <button onClick={clearDialog}>Close</button>
            </div>
        </div>}
    </>);
}