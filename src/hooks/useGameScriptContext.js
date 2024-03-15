import { useContext } from "react";
import GameContext, { TREASURE } from "../contexts/GameContext";

export default function useGameScriptContext() {
    const { addGold } = useContext(GameContext);
    
    return {
        giveTreasure: (type, amount, data) => {
            if (type === TREASURE.GOLD) {
                addGold(amount);
            } else {
                console.error(`Unknown treasure type: ${type}`);
            }
        },
    };
}