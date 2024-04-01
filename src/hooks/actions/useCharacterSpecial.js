import { useContext } from "react";
import GameContext from "../../contexts/GameContext";
import useCharacterSkill from "../useCharacterSkill";

export default function useCharacterSpecial() {
    const { activeCharacterIndex, characters } = useContext(GameContext);
    const characterSkill = useCharacterSkill();

    return () => {
        const character = characters[activeCharacterIndex];
        
        characterSkill(character, "special");
    }
}