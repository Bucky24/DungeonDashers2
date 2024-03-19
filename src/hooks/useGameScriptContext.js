import { useContext } from "react";
import GameContext, { TREASURE } from "../contexts/GameContext";
import UIContext, { LOCATION } from "../contexts/UIContext";
import useRunMapTrigger from "./useRunMapTrigger";

export default function useGameScriptContext() {
    const { addGold } = useContext(GameContext);
    const { enterCellSelect } = useContext(UIContext);
    const runMapTrigger = useRunMapTrigger();
    
    return {
        LOCATION,
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
        runTrigger: (name) => {
            return runMapTrigger(name); 
        },
    };
}