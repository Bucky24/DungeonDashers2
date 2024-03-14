import { useContext } from "react";
import GameContext from "../../contexts/GameContext";

export default function useMoveActiveCharacter() {
    const { activeCharacterIndex, moveCharacter, characters } = useContext(GameContext);

    return (xOff, yOff) => {
        const character = characters[activeCharacterIndex];
        if (!character) {
            console.warn("No active character");
            return;
        }

        // TODO: collision detection

        moveCharacter(activeCharacterIndex, character.x + xOff, character.y + yOff);
    }
}