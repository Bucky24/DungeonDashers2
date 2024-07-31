import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MenuOuter from '../components/MenuOuter';
import SettingsContext, { ACTIONS } from '../contexts/SettingsContext';

export default function SettingsControlsMenu() {
    const { getControlForAction, setActionControl } = useContext(SettingsContext);
    const [editAction, setEditAction] = useState(null);
    const navigate = useNavigate();

    const displayControl = (control) => {
        const [type] = control.split("_");
        const item = control.replace(`${type}_`, "");

        if (type == "KEY") {
            return "Key " + item;
        }
    };

    useEffect(() => {
        const handleAction = (e) => {
            const { code } = e;
            if (editAction) {
                setActionControl(editAction, `KEY_${code}`);
                setEditAction(null);
            }
        }

        window.addEventListener("keyup", handleAction, false);

        return () => {
            window.removeEventListener("keyup", handleAction, false);
        }
    });

    return <MenuOuter center>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
        }}>
            <div style={{
                width: '75%',
                height: '75%',
                backgroundColor: 'rgba(1,1,1,0.5)',
                border: '1px solid black',
                padding: 10,
                color: 'white',
            }}>
                <h2>Controls</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                }}>
                    {ACTIONS.map(action => {
                        return <React.Fragment key={action}>
                            <div>{action}</div>
                            <div onClick={() => {
                                setEditAction(action);
                            }}>
                                {editAction !== action && displayControl(getControlForAction(action))}
                                {editAction === action && "Press a key to set"}
                            </div>
                        </React.Fragment>;
                    })}
                </div>
                <button onClick={() => {
                    navigate("/settings");
                }}>Back</button>
            </div>
        </div>
    </MenuOuter>
}