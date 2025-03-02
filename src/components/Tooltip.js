import React, { useContext, useEffect, useState } from 'react';
import SettingsContext, { ACTION_MAP } from '../contexts/SettingsContext';

export default function Tooltip({ text }) {
    const [useText, setUseText] = useState('');
    const { getControlForAction } = useContext(SettingsContext);

    useEffect(() => {
        const validParams = {
            'SPECIAL_KEY': getControlForAction(ACTION_MAP.SPECIAL_ACTION),
            'CURRENT_CHARACTER': null,
        };
        let currentText = text;
        for (const param in validParams) {
            const value = validParams[param] || `[unhandled ${param}]`;
            currentText = currentText.replaceAll(`{${param}}`, value);
        }
        setUseText(currentText);
    }, [text]);

    return <div style={{
        position: 'fixed',
        bottom: 40,
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
    }}>
        <div style={{
            backgroundColor: 'white',
            padding: 10,
            display: 'inline-block',
        }}>
            {useText}
        </div>
    </div>
}