import React, { useContext } from 'react';

import EditorContext, { EDITOR_MAP_TOOLS} from '../contexts/EditorContext';
import ModuleContext from '../contexts/ModuleContext';

export default function EditorControls() {
    const {
        saveMap,
        hoveredEntities,
        activeTile,
        setActiveTile,
        tool,
        setTool,
    } = useContext(EditorContext);
    const { tiles } = useContext(ModuleContext);

    return (
        <div
            style={{
                position: 'absolute',
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
                    {hoveredEntities?.map((entity) => {
                        return <div key={`hovered_${entity.data.x}_${entity.data.y}_${entity.data.id}`}>{entity.type} {entity.data.id} at ({entity.data.x},{entity.data.y})</div>;
                    })}
                </div>
            </div>
            <div>
                <div>Current Tool:</div>
                <select value={tool} onChange={(e) => setTool(e.target.value)}>
                    <option value="">Select a tool</option>
                    {Object.keys(EDITOR_MAP_TOOLS).map((key) => {
                        return <option key={`tool_${key}`} value={EDITOR_MAP_TOOLS[key]}>{key}</option>
                    })}
                </select>
            </div>
            <div>
                <div>Selected Tile:</div>
                <select value={activeTile} onChange={(e) => setActiveTile(e.target.value)}>
                    <option value=''>Select a tile</option>
                    {Object.keys(tiles).map((tile) => {
                        const data = tiles[tile];

                        return <option key={`select_tile_${tile}`} value={tile}>{tile} ({data.type})</option>
                    })}
                </select>
            </div>
        </div>
    );
}