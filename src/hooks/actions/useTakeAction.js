import useMoveActiveCharacter from "./useMoveActiveCharacter";
import { ACTION_MAP } from '../../contexts/SettingsContext';
import useCharacterSpecial from "./useCharacterSpecial";
import { useContext } from "react";
import GameContext, { COMBAT_TURN } from "../../contexts/GameContext";
import ModuleContext from "../../contexts/ModuleContext";
import UIContext, { UI_MODE } from "../../contexts/UIContext";

export default function takeAction() {
    const moveActiveCharacter = useMoveActiveCharacter();
    const characterSpecial = useCharacterSpecial();
    const {
        activeCharacterIndex,
        characters,
        setCharacterProperty,
        setNextActiveCharacter,
    } = useContext(GameContext);
    const { characters: characterData } = useContext(ModuleContext);
    const { setShowMenu, setMode, setActiveMenuItem } = useContext(UIContext);

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
            setNextActiveCharacter();
        },
        [ACTION_MAP.OPEN_MENU]: () => {
            setShowMenu(true);
            setMode(UI_MODE.MENU);
            setActiveMenuItem(0);
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