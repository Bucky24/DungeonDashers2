import useMoveActiveCharacter from "./useMoveActiveCharacter";
import { ACTION_MAP } from '../../contexts/SettingsContext';
import useCharacterSpecial from "./useCharacterSpecial";
import { useContext } from "react";
import GameContext from "../../contexts/GameContext";
import UIContext, { UI_MODE } from "../../contexts/UIContext";
import { getCharacters } from "../../data/moduleData";
import { getMaxActionPoints } from "../../data/attributeHelper";

export default function takeAction() {
    const moveActiveCharacter = useMoveActiveCharacter();
    const characterSpecial = useCharacterSpecial();
    const {
        activeCharacterIndex,
        characters,
        setCharacterProperty,
        setNextActiveCharacter,
        paused,
    } = useContext(GameContext);
    const characterData = getCharacters();
    const {
        setShowMenu,
        setMode,
        setActiveMenuItem,
        dialog,
        clearDialog,
    } = useContext(UIContext);

    const actionMap = {
        [ACTION_MAP.MOVE_LEFT]: () => {
            if (paused) return;
            moveActiveCharacter(-1, 0);
        },
        [ACTION_MAP.MOVE_RIGHT]: () => {
            if (paused) return;
            moveActiveCharacter(1, 0);
        },
        [ACTION_MAP.MOVE_UP]: () => {
            if (paused) return;
            moveActiveCharacter(0, -1);
        },
        [ACTION_MAP.MOVE_DOWN]: () => {
            if (paused) return;
            moveActiveCharacter(0, 1);
        },
        [ACTION_MAP.SPECIAL_ACTION]: () => {
            if (paused) return;
            characterSpecial();
        },
        [ACTION_MAP.NEXT_CHARACTER]: () => {
            if (paused) return;
            const activeCharacter = characters[activeCharacterIndex];
            setCharacterProperty(activeCharacter.type, "actionPoints", getMaxActionPoints(activeCharacter));
            setNextActiveCharacter();
        },
        [ACTION_MAP.OPEN_MENU]: () => {
            setShowMenu(true);
            setMode(UI_MODE.MENU);
            setActiveMenuItem(0);
        },
        [ACTION_MAP.CLOSE_DIALOG]: () => {
            if (dialog) {
                clearDialog();
                return true;
            }
        },
    };

    return (action) => {
        if (!actionMap[action]) {
            console.error(`Unhandled action ${action}`);
            return;
        }

        return actionMap[action]();
    }
}