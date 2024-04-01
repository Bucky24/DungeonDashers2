import { useContext } from "react";

import SettingsContext from "../contexts/SettingsContext";
import useTakeAction from '../hooks/actions/useTakeAction';

function useHandleInput() {
    const { getActionForControl } = useContext(SettingsContext);
    const takeAction = useTakeAction();

    return (input) => {
        const action = getActionForControl(input);
        if (!action) {
            return;
        }

        takeAction(action);
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