import { useContext } from "react";
import GameContext, { TREASURE } from "../contexts/GameContext";
import UIContext, { LOCATION } from "../contexts/UIContext";
import useRunMapTrigger from "./useRunMapTrigger";

export default function useGameScriptContext() {
    const {
        addGold,
        setPaused,
        centerCamera,
        addCharacter,
        setActiveCharacterIndex,
        resetCamera,
        characters,
    } = useContext(GameContext);
    const { enterCellSelect, startDialog } = useContext(UIContext);
    const runMapTrigger = useRunMapTrigger();
    
    return {
        LOCATION,
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
    };
}