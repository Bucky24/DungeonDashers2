import { useContext } from "react";

import SettingsContext from "../contexts/SettingsContext";
import useTakeAction from '../hooks/actions/useTakeAction';

function useHandleInput() {
    const { getActionsForControl } = useContext(SettingsContext);
    const takeAction = useTakeAction();

    return (input) => {
        const actions = getActionsForControl(input);
        for (const action of actions) {
            const result = takeAction(action);
            // if true is returned, the action was handled
            if (result) {
                break;
            }
        }
    }
}

export function useHandleKeyboard() {
    const handleInput = useHandleInput();

    return (input) => {
        const fullInput = `KEY_${input}`;

        handleInput(fullInput);
    }
}

export function useHandleMouse() {
    return (input) => {
        
    }
}