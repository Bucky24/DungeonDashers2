import useMoveActiveCharacter from "./useMoveActiveCharacter";
import { ACTION_MAP } from '../../contexts/SettingsContext';
import useCharacterSpecial from "./useCharacterSpecial";
import { useContext } from "react";
import GameContext from "../../contexts/GameContext";

export default function takeAction() {
    const moveActiveCharacter = useMoveActiveCharacter();
    const characterSpecial = useCharacterSpecial();
    const { activeCharacterIndex, setActiveCharacterIndex, characters } = useContext(GameContext);

    const actionMap = {
        [ACTION_MAP.MOVE_LEFT]: () => moveActiveCharacter(-1, 0),
        [ACTION_MAP.MOVE_RIGHT]: () => moveActiveCharacter(1, 0),
        [ACTION_MAP.MOVE_UP]: () => moveActiveCharacter(0, -1),
        [ACTION_MAP.MOVE_DOWN]: () => moveActiveCharacter(0, 1),
        [ACTION_MAP.SPECIAL_ACTION]: characterSpecial,
        [ACTION_MAP.NEXT_CHARACTER]: () => {
            let nextIndex = activeCharacterIndex + 1;
            if (nextIndex >= characters.length) {
                nextIndex = 0;
            }
            setActiveCharacterIndex(nextIndex);
        },
    };

    return (action) => {
        if (!actionMap[action]) {
            console.error(`Unhandled action ${action}`);
            return;
        }

        actionMap[action]();
    }
}