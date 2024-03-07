import React, { useContext } from 'react';
import UIContext, { PANES } from '../contexts/UIContext';
import EditorContext from '../contexts/EditorContext';
import GameContext from '../contexts/GameContext';

export default function Home() {
    const { setPane } = useContext(UIContext);
    const { loadMap } = useContext(EditorContext);
    const { newGame } = useContext(GameContext);

    return <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => {
            newGame("map1");
            setPane(PANES.APP);
        }}>Game (map1)</button>
        <button onClick={() => {
            newGame("humble_beginnings");
            setPane(PANES.APP);
        }}>Game (humble beginnings)</button>
        <button>Module editor (main)</button>
        <button onClick={() => {
            loadMap("map1");
            setPane(PANES.EDITOR_MAP);
        }}>Map Editor (map1)</button>
        <button onClick={() => {
            loadMap("humble_beginnings");
            setPane(PANES.EDITOR_MAP);
        }}>Map Editor (humble beginnings)</button>
    </div>
}