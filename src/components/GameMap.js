import React, { useContext, useEffect } from 'react';

import styles from './GameMap.css';

import TheMap from './TheMap';
import MapContext from '../contexts/MapContext';
import { useHandleKeyboard } from '../utils/handleInput';
import GameContext, { COMBAT_TURN, GAME_STATE } from '../contexts/GameContext';
import UIContext, { MENU_ITEMS, UI_MODE } from '../contexts/UIContext';
import ModuleContext from '../contexts/ModuleContext';
import useRunScript from '../hooks/useRunScript';
import useGetEntityContext from '../hooks/useGetEntityContext';
import useTriggerEvent from '../hooks/events/useTriggerEvent';
import GameMenu from './GameMenu';
import SaveDialog from './SaveDialog';
import VictoryDialog from './VictoryDialog';
import DialogTopLeftImage from '../../assets/dialog_top_left.png';
import DialogBottomRightImage from '../../assets/dialog_bottom_right.png';

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
        setCombatTurn,
        setActiveEnemyIndex,
        setNextActiveCharacter,
        gameState,
    } = useContext(GameContext);
    const {
        mode,
        cellSelectData,
        markCellSelected,
        acceptSelectedCell,
        dialog,
        clearDialog,
        showMenu,
        activeMenuItem,
        setActiveMenuItem,
        chooseMenuItem,
    } = useContext(UIContext);
    const {
        characters: characterData,
        enemies: enemyData,
        getImage,
    } = useContext(ModuleContext);
    const handleKeyboard = useHandleKeyboard();
    const runScript = useRunScript();
    const getEntityContext = useGetEntityContext();
    const triggerEvent = useTriggerEvent();

    useEffect(() => {
        const nextEnemy = () => {
            // move to next enemy as appropriate or switch back to characters
            const nextIndex = activeEnemyIndex + 1;
            if (nextIndex >= enemies.length) {
                setCombatTurn(COMBAT_TURN.PLAYER);

                setNextActiveCharacter(0);
                setActiveEnemyIndex(-1);
            } else {
                setActiveEnemyIndex(nextIndex);
            }
        }
        if (combatTurn === COMBAT_TURN.ENEMY && hasActiveEnemies) {
            const enemy = enemies[activeEnemyIndex];
            const data = enemyData[enemy.type];

            if (enemy.flags.includes("inactive")) {
                nextEnemy();
                return;
            }

            const aiScript = data?.skills?.ai;

            if (!aiScript) {
                console.error(`Cannot find AI script for ${enemy.type}`);
            }

            const actualScript = data.scripts[aiScript.file];

            runScript(actualScript.script, {
                entity: getEntityContext({ type: 'enemy', entity: enemy }, triggerEvent),
            }).then(() => {
                nextEnemy();
            });
        }
    }, [combatTurn, activeEnemyIndex]);

    let totalAp = 1;
    let maxAp = 1;
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
    } else if (combatTurn === COMBAT_TURN.ENEMY) {
        const activeEnemy = enemies[activeEnemyIndex];
        if (activeEnemy) {
            const activeData = enemyData[activeEnemy.type];
            totalAp = activeEnemy.actionPoints;
            if (totalAp === undefined) {
                totalAp = activeData?.actionPoints || 0;
            }
            maxAp = activeData?.actionPoints;
            combatName = activeData?.name || "";
        }
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
            fullFocus={mode === UI_MODE.GAME || mode === UI_MODE.CELL_SELECT}
            onKey={(code) => {
                if (combatTurn === COMBAT_TURN.ENEMY) {
                    return;
                }
                if (mode === UI_MODE.GAME) {
                    handleKeyboard(code);
                } else if (mode === UI_MODE.CELL_SELECT) {
                    if (paused) {
                        return;
                    }
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
                } else if (mode === UI_MODE.MENU) {
                    if (code === "ArrowUp") {
                        setActiveMenuItem(Math.max(0, activeMenuItem - 1));
                    } else if (code === "ArrowDown") {
                        setActiveMenuItem(Math.min(MENU_ITEMS.length-1, activeMenuItem + 1));
                    } else if (code === "Enter") {
                        chooseMenuItem();
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
                {dialog.character && characterData[dialog.character] && characterData[dialog.character].images.dialog_portrait && <img
                    className={styles.dialog_portrait}
                    src={getImage(characterData[dialog.character].images.dialog_portrait.image)}
                />}
                <img src={DialogTopLeftImage} className={styles.dialog_top_left} />
                <img src={DialogBottomRightImage} className={styles.dialog_bottom_right} />
                <div>{dialog.dialog}</div>
            </div>
        </div>}
        {showMenu && <div className={styles.menu_outer}>
            <div className={styles.menu_inner}>
                <GameMenu />
            </div>
        </div>}
        {mode === UI_MODE.SAVE_MENU && <SaveDialog />}
        {gameState === GAME_STATE.WON && <VictoryDialog />}
    </>);
}