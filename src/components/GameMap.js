import React, { useContext, useEffect } from 'react';

import styles from './GameMap.css';

import TheMap from './TheMap';
import MapContext from '../contexts/MapContext';
import { useHandleKeyboard } from '../utils/handleInput';
import GameContext, { COMBAT_TURN } from '../contexts/GameContext';
import UIContext, { UI_MODE } from '../contexts/UIContext';
import ModuleContext from '../contexts/ModuleContext';
import useRunScript from '../hooks/useRunScript';
import useGetEntityContext from '../hooks/useGetEntityContext';

export default function GameMap() {
    const { map } = useContext(MapContext);
    const {
        objects,
        characters,
        enemies,
        activeCharacterIndex,
        paused,
        cameraCenterPos,
        hasActiveEnemies,
        combatTurn,
        activeEnemyIndex,
    } = useContext(GameContext);
    const {
        mode,
        cellSelectData,
        markCellSelected,
        acceptSelectedCell,
        dialog,
        clearDialog,
    } = useContext(UIContext);
    const { characters: characterData, enemies: enemyData } = useContext(ModuleContext);
    const handleKeyboard = useHandleKeyboard();
    const runScript = useRunScript();
    const getEntityContext = useGetEntityContext();

    useEffect(() => {
        if (combatTurn === COMBAT_TURN.ENEMY && hasActiveEnemies) {
            const enemy = enemies[activeEnemyIndex];
            const data = enemyData[enemy.type];

            const aiScript = data?.skills?.ai;

            if (!aiScript) {
                console.error(`Cannot find AI script for ${enemy.type}`);
            }

            const actualScript = data.scripts[aiScript.file];

            runScript(actualScript.script, {
                entity: getEntityContext({ type: 'enemy', entity: enemy }),
            }).then(() => {
                console.log('enemy ai done');
            });
        }
    }, [combatTurn, activeEnemyIndex]);

    let totalAp;
    let maxAp;
    let combatName;
    if (combatTurn === COMBAT_TURN.PLAYER) {
        const activeCharacter = characters[activeCharacterIndex];
        const activeData = characterData[activeCharacter.type];
        totalAp = activeCharacter.actionPoints;
        if (totalAp === undefined) {
            totalAp = activeData.actionPoints;
        }
        maxAp = activeData?.actionPoints;
        combatName = activeData.name;
    } else {
        const activeEnemy = enemies[activeEnemyIndex];
        const activeData = enemyData[activeEnemy.type];
        totalAp = activeEnemy.actionPoints;
        if (totalAp === undefined) {
            totalAp = activeData.actionPoints;
        }
        maxAp = activeData?.actionPoints;
        combatName = activeData.name;
    }

    return (<>
        <TheMap
            map={map}
            objects={objects}
            zoomLocked={true}
            zoom={200}
            characters={characters}
            enemies={enemies}
            inCombat={hasActiveEnemies}
            combatTurnName={combatName}
            combatPointsLeft={totalAp}
            combatPointsMax={maxAp}
            onKey={(code) => {
                if (paused || combatTurn !== COMBAT_TURN.PLAYER) {
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