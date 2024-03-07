import React, { useContext } from 'react';
import UIContext, { PANES } from '../contexts/UIContext';
import EditorContext from '../contexts/EditorContext';

export default function Home() {
    const { setPane } = useContext(UIContext);
    const { loadMap } = useContext(EditorContext);

    return <div>
        <button onClick={() => {
            setPane(PANES.APP);
        }}>Game (map1)</button>
        <button>Module editor (main)</button>
        <button onClick={() => {
            loadMap("map1");
            setPane(PANES.EDITOR_MAP);
        }}>Map Editor (map1)</button>
    </div>
}