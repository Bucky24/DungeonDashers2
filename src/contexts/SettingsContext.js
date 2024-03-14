import React, { useEffect, useState } from 'react';
import Coms from '../utils/coms';

const SettingsContext = React.createContext();
export default SettingsContext;

const ACTIONS = [
    'MOVE_LEFT',
];

const ACTION_MAP = ACTIONS.reduce((obj, action) => {
    return {
        ...obj,
        [action]: action,
    };
}, {});

const DEFAULT_CONTROLS = {
    [ACTION_MAP.MOVE_LEFT]: 'KEY_ArrowLeft',
};

export function SettingsProvider({ children }) {
    const [controls, setControls] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [actionsByControl, setActionsByControl] = useState({});

    useEffect(() => {
        Coms.send("getSettings", {}).then((settings) => {
            setControls(settings.controls || {});

            setLoaded(true);
        });
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
        loaded,
    };

    return <SettingsContext.Provider value={value}>
        {children}
    </SettingsContext.Provider>
}