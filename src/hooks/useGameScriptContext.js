import { useContext } from "react";
import GameContext, { TREASURE, MOVEMENT, COMBAT_ACTION, GAME_STATE, TARGET_TYPE } from "../contexts/GameContext";
import UIContext, { LOCATION, LOCATION_FILTER, UI_MODE } from "../contexts/UIContext";
import useRunMapTrigger from "./useRunMapTrigger";
import useGetEntityContext from "./useGetEntityContext";
import useTriggerEvent from "./events/useTriggerEvent";
import MapContext, { TILE_TYPE } from "../contexts/MapContext";
import { getTiles, getEquipment, getTile, getObject } from "../data/moduleData";

export default function useGameScriptContext(triggerEvent) {
    const {
        addGold,
        setPaused,
        centerCamera,
        addCharacter,
        setActiveCharacterIndex,
        resetCamera,
        getEntitiesAtPosition,
        getEntities,
        characters,
        objects,
        enemies,
        setGameState,
        addEquipment,
        getTilesAtPosition,
    } = useContext(GameContext);
    const { getTile } = useContext(MapContext);
    const tiles = getTiles();
    const equipment = getEquipment();
    const { enterCellSelect, startDialog, setMode, setTooltip, getCellsMatching } = useContext(UIContext);
    const runMapTrigger = useRunMapTrigger();
    const getEntityContext = useGetEntityContext();
    const finalTriggerEvent = triggerEvent || useTriggerEvent();
    
    const context = {
        LOCATION,
        LOCATION_FILTER,
        MOVEMENT,
        COMBAT_ACTION,
        TARGET_TYPE,
        characterCount: characters.length,
        giveTreasure: (type, amount, data) => {
            if (type === TREASURE.GOLD) {
                addGold(amount);
            } else if (type === TREASURE.EQUIPMENT) {
                const { type: equipmentId } = data;

                if (!equipment[equipmentId]) {
                    console.error(`Cannot find equipment with id ${equipmentId}`);
                } else {
                    addEquipment(equipmentId);
                }
            } else {
                console.error(`Unknown treasure type: ${type}`);
            }
        },
        userChooseLocation: (x, y, min, max, directionOrPoints, filter) => {
            return new Promise((resolve) => {
                enterCellSelect(x, y, min, max, directionOrPoints, filter, resolve);
            });
        },
        runTrigger: function(name) {
            return runMapTrigger(name, { game: this }); 
        },
        setPause: (pause) => {
            setPaused(pause);
        },
        showDialog: (dialog, character) => {
            return new Promise((resolve) => {
                startDialog(dialog, character, resolve);
            });
        },
        centerCamera,
        createCharacter: function(type, x, y) {
            // we can't rely on addCharacter to give us a new index
            // because setState is equivalent to async
            const newIndex = this.characterCount++;
            addCharacter(type, x, y);
            return newIndex;
        },
        setActiveCharacter: (index) => {
            setActiveCharacterIndex(index);
        },
        resetCamera,
        getEntitiesAt: (x, y) => {
            const entities = getEntitiesAtPosition(x, y);
            const contexts = entities.map((entity) => {
                return getEntityContext(entity, finalTriggerEvent);
            });

            return contexts;
        },
        sleep: (time) => {
            return new Promise((resolve) => {
                setTimeout(resolve, time);
            });
        },
        isAccessible: (movement, x, y) => {
            const tile = getTile(x, y);
            const tileData = tiles[tile?.tile];
    
            if (tileData?.type !== TILE_TYPE.GROUND) {
                return false;
            }

            return true;
        },
        showMultipleDialog: async (dialogs) => {
            for (const dialogData of dialogs) {
                await new Promise((resolve) => {
                    startDialog(dialogData.dialog, dialogData.character, resolve);
                });
            }
        },
        triggerEvent: async (event, other) => {
            for (const entity of getEntities()) {
                await finalTriggerEvent(event, [entity, other._getEntity()]);
            }
        },
        getEntitiesWithinRange: (x, y, range) => {
            const coords = [];
            for (let i=1;i<=range;i++) {
                // top line
                for (let loopX=x-i;loopX<=x+i;loopX++) {
                    coords.push([loopX, y-i]);
                }

                // bottom line
                for (let loopX=x-i;loopX<=x+i;loopX++) {
                    coords.push([loopX, y+i]);
                }

                // left line not counting top and bottom
                for (let loopY=y-i+1;loopY<=y+i-1;loopY++) {
                    coords.push([x-i, loopY]);
                }

                // right line not counting top and bottom
                for (let loopY=y-i+1;loopY<=y+i-1;loopY++) {
                    coords.push([x+i, loopY]);
                }
            }

            let entities = [];
            for (const coord of coords) {
                const atPosition = getEntitiesAtPosition(coord[0], coord[1]);
                entities = [...entities, ...atPosition];
            }
            const contexts = entities.map((entity) => {
                return getEntityContext(entity, finalTriggerEvent);
            });

            return contexts;
        },
        distanceBetweenEntities: (entity1, entity2) => {
            return Math.sqrt(Math.pow(entity2.x - entity1.x, 2) + Math.pow(entity2.y - entity1.y, 2));
        },
        getCharacterByType: (type) => {
            for (const character of characters) {
                if (character.type === type) {
                    return getEntityContext({ type: 'character', entity: character });
                }
            }

            return null;
        },
        getEntityById: (id) => {
            for (const entity of objects) {
                if (entity.id === id) {
                    return getEntityContext({ type: 'object', entity });
                }
            }
            for (const entity of characters) {
                if (entity.id === id) {
                    return getEntityContext({ type: 'character', entity });
                }
            }
            for (const entity of enemies) {
                if (entity.id === id) {
                    return getEntityContext({ type: 'enemy', entity });
                }
            }

            return null;
        },
        getEntitiesOfType: (entityType, type) => {
            const matching = [];
            let entities = [];
            if (entityType === "object") {
                entities = objects;
            } else if (entityType === "character") {
                entities = characters;
            } else if (entityType == "enemy") {
                entities = enemies;
            }
            if (!type) {
                return entities.map(entity => getEntityContext({ type: entityType, entity }));
            }
            for (const entity of entities) {
                if (entity.type === type) {
                    matching.push(getEntityContext({ type: entityType, entity }));
                }
            }

            return matching;
        },
        victory: () => {
            setMode(UI_MODE.GAME_END);
            setGameState(GAME_STATE.WON);
        },
        getTargets: (targetType, x, y, range, ignoreLos) => {
            const entities = context.getEntitiesWithinRange(x, y, range);

            const targets = entities.filter((entity) => {
                switch (targetType) {
                    case TARGET_TYPE.ATTACKABLE:
                        return entity.entityType === "enemy" || entity.flags && entity.flags.includes("attackable");
                    default:
                        throw new Error(`Invalid target type ${targetType}`);
                }
            });

            const targetsInSight = targets.filter((entity) => {
                console.log('cehcking at', x, y, entity.x, entity.y);
                if (!ignoreLos) {
                    // verify we can see the entity from x, y
                    // how we do this is basically plot every square from
                    // entity to our x, y and check if it's visible. If it
                    // isn't, then we can't see this target
                    const xDist = Math.abs(entity.x - x);
                    const yDist = Math.abs(entity.y - y);
                    let xPer, yPer, min, max;
                    if (xDist > yDist) {
                        const negative = entity.x > x ? entity.y < y : y < entity.y;
                        const dir = negative ? -1 : 1;
                        xPer = 1;
                        yPer = yDist / xDist * dir;
                        min = Math.min(entity.x, x);
                        max = Math.max(entity.x, x);
                    } else {
                        const negative = entity.y > y ? entity.x < x : x < entity.x;
                        const dir = negative ? -1 : 1;
                        yPer = 1;
                        xPer = (xDist / yDist) * dir;
                        min = Math.min(entity.y, y);
                        max = Math.max(entity.y, y);
                    }
                    let xCur = x;
                    let yCur = y;
                    for (let i=min;i<=max;i+=1) {
                        // check current square
                        const unitX = Math.round(xCur);
                        const unitY = Math.round(yCur);

                        const entities = getEntitiesAtPosition(unitX, unitY);
                        const tilesOnSquare = getTilesAtPosition(unitX, unitY);
                        console.log(unitX, unitY, tilesOnSquare);

                        for (const entity of entities) {
                            const data = getObject(entity.entity.type);
                            if (entity.entity.flags?.includes("wall")) {
                                return false;
                            }
                        }

                        for (const tile of tilesOnSquare) {
                            if (tiles[tile.tile]) {
                                const type = getTile(tile.tile)?.type;
                                if (type === "wall") {
                                    return false;
                                }
                            }
                        }

                        xCur += xPer;
                        yCur += yPer;
                    }
                }

                return true;
            })

            return targetsInSight;
        },
        showTooltip: (text) => {
            setTooltip(text);
        },
        findValidLocation: (x, y, min, max, directionOrPoints, filter) => {
            const cells = getCellsMatching(x, y, min, max, directionOrPoints, filter);

            if (cells.length === 0) {
                return null;
            }

            return cells[0];
        }
    };

    return context;
}