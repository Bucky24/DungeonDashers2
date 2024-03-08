import React, { useContext } from 'react';

import EditorContext from '../contexts/EditorContext';
import ModuleContext from '../contexts/ModuleContext';

export default function EditorControls() {
    const { saveMap, hoveredTiles, activeTile, setActiveTile } = useContext(EditorContext);
    const { tiles } = useContext(ModuleContext);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                backgroundColor: "#fff",
                display: 'flex',
            }}
        >
            <div>
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
                        return <div>{tile.tile} at ({tile.x},{tile.y})</div>;
                    })}
                </div>
            </div>
            <div>
                <div>Selected Tile:</div>
                <select value={activeTile} onChange={(e) => setActiveTile(e.target.value)}>
                    <option value={null}>Select a tile</option>
                    {Object.keys(tiles).map((tile) => {
                        const data = tiles[tile];

                        return <option value={tile}>{tile} ({data.type})</option>
                    })}
                </select>
            </div>
        </div>
    );
}