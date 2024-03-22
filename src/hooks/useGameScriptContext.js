import { useContext } from "react";
import GameContext, { TREASURE, MOVEMENT } from "../contexts/GameContext";
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
        }
    };
}