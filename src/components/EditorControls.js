import React, { useContext } from 'react';

import EditorContext from '../contexts/EditorContext';

export default function EditorControls() {
    const { saveMap, hoveredTiles } = useContext(EditorContext);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                backgroundColor: "#fff"
            }}
        >
            <button
                onClick={() => {
                    saveMap();
                }}
            >
                Save
            </button>
            <div>
                <div>Hovered:</div>
                {hoveredTiles?.map((tile) => {
                    return <div>{tile.tile} at (${tile.x},${tile.y})</div>;
                })}
            </div>
        </div>
    );
}