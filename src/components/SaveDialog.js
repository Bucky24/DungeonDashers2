import React, { useContext, useEffect, useRef } from 'react';

import UIContext, { UI_MODE } from '../contexts/UIContext';
import GameContext from '../contexts/GameContext';
import DialogBase from './DialogBase';
import { useNavigate } from 'react-router-dom';

export default function SaveDialog() {
    const inputRef = useRef();
    const { setMode } = useContext(UIContext);
    const { saveGame } = useContext(GameContext);
    const navigate = useNavigate();

    useEffect(() => {
        inputRef.current.focus();
    }, [inputRef.current]);

    return <DialogBase>
        <h3>Enter save game name</h3>
        <h4>Enter to continue, Esc to cancel</h4>
        <input ref={inputRef} type="text" onKeyDown={async (e) => {
            const code = e.code;

            if (code === "Escape") {
                e.stopPropagation();
                setMode(UI_MODE.GAME);
            } else if (code === "Enter") {
                const name = inputRef.current.value;
                if (name === "") {
                    return;
                }
                e.stopPropagation();
                await saveGame(name);
                navigate(`/game/load/${name}`);
                setMode(UI_MODE.GAME);
            }
        }} />
    </DialogBase>
}