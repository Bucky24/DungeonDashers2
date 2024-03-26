import React, { useContext, useEffect, useRef } from 'react';
import UIContext, { UI_MODE } from '../contexts/UIContext';
import GameContext from '../contexts/GameContext';

export default function SaveDialog() {
    const dialogRef = useRef();
    const inputRef = useRef();
    const { setMode } = useContext(UIContext);
    const { saveGame } = useContext(GameContext);

    useEffect(() => {
        dialogRef.current.show();
    }, [dialogRef.current]);

    useEffect(() => {
        inputRef.current.focus();
    }, [inputRef.current]);

    return <dialog style={{ top: 40 }} ref={dialogRef}>
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
                setMode(UI_MODE.GAME);
            }
        }} />
    </dialog>
}