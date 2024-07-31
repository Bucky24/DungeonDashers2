import React, { useEffect, useState } from 'react';
import Coms from '../utils/coms';

const SettingsContext = React.createContext();
export default SettingsContext;

export const ACTIONS = [
    'MOVE_LEFT',
    'MOVE_RIGHT',
    'MOVE_DOWN',
    'MOVE_UP',
    'SPECIAL_ACTION',
    'NEXT_CHARACTER',
    'OPEN_MENU',
];

export const ACTION_MAP = ACTIONS.reduce((obj, action) => {
    return {
        ...obj,
        [action]: action,
    };
}, {});

const DEFAULT_CONTROLS = {
    [ACTION_MAP.MOVE_LEFT]: 'KEY_ArrowLeft',
    [ACTION_MAP.MOVE_RIGHT]: 'KEY_ArrowRight',
    [ACTION_MAP.MOVE_DOWN]: 'KEY_ArrowDown',
    [ACTION_MAP.MOVE_UP]: 'KEY_ArrowUp',
    [ACTION_MAP.SPECIAL_ACTION]: 'KEY_Enter',
    [ACTION_MAP.NEXT_CHARACTER]: 'KEY_Space',
    [ACTION_MAP.OPEN_MENU]: 'KEY_Escape',
};

export function SettingsProvider({ children }) {
    const [controls, setControls] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [actionsByControl, setActionsByControl] = useState({});

    const loadSettings = () => {
        Coms.send("getSettings", {}).then((result) => {
            setControls(result.settings.controls || {});

            setLoaded(true);
        });
    }

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        const newActionsByControls = {};
        for (const action of ACTIONS) {
            const control = controls[action] || DEFAULT_CONTROLS[action];
            newActionsByControls[control] = action;
        }
        setActionsByControl(newActionsByControls);
    }, [controls]);

    const value = {
        getControlForAction: (action) => {
            return controls[action] || DEFAULT_CONTROLS[action];
        },
        getActionForControl: (control) => {
            return actionsByControl[control];
        },
        setActionControl: (action, control) => {
            const newControls = {...controls,[action]: control};

            Coms.send("setSetting", { setting: 'controls', data: newControls }).then(() => {
                loadSettings();
            });
        },
        loaded,
    };

    return <SettingsContext.Provider value={value}>
        {children}
    </SettingsContext.Provider>
}