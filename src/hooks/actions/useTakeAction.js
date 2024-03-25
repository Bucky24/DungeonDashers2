import useMoveActiveCharacter from "./useMoveActiveCharacter";
import { ACTION_MAP } from '../../contexts/SettingsContext';
import useCharacterSpecial from "./useCharacterSpecial";
import { useContext } from "react";
import GameContext, { COMBAT_TURN } from "../../contexts/GameContext";
import ModuleContext from "../../contexts/ModuleContext";

export default function takeAction() {
    const moveActiveCharacter = useMoveActiveCharacter();
    const characterSpecial = useCharacterSpecial();
    const {
        activeCharacterIndex,
        setActiveCharacterIndex,
        characters,
        setCharacterProperty,
        setCombatTurn,
        hasActiveEnemies,
        setActiveEnemyIndex,
    } = useContext(GameContext);
    const { characters: characterData } = useContext(ModuleContext);

    const actionMap = {
        [ACTION_MAP.MOVE_LEFT]: () => moveActiveCharacter(-1, 0),
        [ACTION_MAP.MOVE_RIGHT]: () => moveActiveCharacter(1, 0),
        [ACTION_MAP.MOVE_UP]: () => moveActiveCharacter(0, -1),
        [ACTION_MAP.MOVE_DOWN]: () => moveActiveCharacter(0, 1),
        [ACTION_MAP.SPECIAL_ACTION]: characterSpecial,
        [ACTION_MAP.NEXT_CHARACTER]: () => {
            const activeCharacter = characters[activeCharacterIndex];
            const charData = characterData[activeCharacter.type];
            setCharacterProperty(activeCharacter.id, "actionPoints", charData.actionPoints);

            let nextIndex = activeCharacterIndex + 1;
            if (nextIndex >= characters.length) {
                if (hasActiveEnemies) {
                    setCombatTurn(COMBAT_TURN.ENEMY);
                    setActiveEnemyIndex(0);
                    return;
                }
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