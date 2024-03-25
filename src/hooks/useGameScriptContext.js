import { useContext } from "react";
import GameContext, { TREASURE, MOVEMENT, COMBAT_ACTION } from "../contexts/GameContext";
import UIContext, { LOCATION } from "../contexts/UIContext";
import useRunMapTrigger from "./useRunMapTrigger";
import useGetEntityContext from "./useGetEntityContext";
import useTriggerEvent from "./events/useTriggerEvent";
import MapContext, { TILE_TYPE } from "../contexts/MapContext";
import ModuleContext from "../contexts/ModuleContext";

export default function useGameScriptContext(triggerEvent) {
    const {
        addGold,
        setPaused,
        centerCamera,
        addCharacter,
        setActiveCharacterIndex,
        resetCamera,
        characters,
        getEntitiesAtPosition,
        getEntities,
    } = useContext(GameContext);
    const { getTile } = useContext(MapContext);
    const { tiles } = useContext(ModuleContext);
    const { enterCellSelect, startDialog } = useContext(UIContext);
    const runMapTrigger = useRunMapTrigger();
    const getEntityContext = useGetEntityContext();
    const finalTriggerEvent = triggerEvent || useTriggerEvent();
    
    return {
        LOCATION,
        MOVEMENT,
        COMBAT_ACTION,
        characterCount: characters.length,
        giveTreasure: (type, amount, data) => {
            if (type === TREASURE.GOLD) {
                addGold(amount);
            } else {
                console.error(`Unknown treasure type: ${type}`);
            }
        },
        userChooseLocation: (x, y, min, max, direction) => {
            return new Promise((resolve) => {
                enterCellSelect(x, y, min, max, direction, resolve);
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
        }
    };
}