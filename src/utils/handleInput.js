import { useContext } from "react";

import SettingsContext from "../contexts/SettingsContext";

function useHandleInput() {
    const { getActionForControl } = useContext(SettingsContext);

    return (input) => {
        const action = getActionForControl(input);
        if (!action) {
            return;
        }

        console.log(action);
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