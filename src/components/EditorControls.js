import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import EditorContext, { EDITOR_MAP_TOOLS } from '../contexts/EditorContext';
import {
    getTiles,
    getObjects,
    getCharacters,
    getEnemies,
} from '../data/moduleData';

export default function EditorControls({ newMap }) {
    const {
        saveMap,
        hoveredEntities,
        activeItem,
        setActiveItem,
        tool,
        setTool,
        map,
        removeUnder,
        setRemoveUnder,
    } = useContext(EditorContext);
    const tiles = getTiles();
    const objects = getObjects();
    const characters = getCharacters();
    const enemies = getEnemies();
    const navigate = useNavigate();

    let toolSelectData = null;
    let toolSelectName = null;
    if (tool === EDITOR_MAP_TOOLS.PLACE_TILE) {
        toolSelectData = tiles;
        toolSelectName = "Tile";
    } else if (tool === EDITOR_MAP_TOOLS.PLACE_OBJECT) {
        toolSelectData = objects;
        toolSelectName = "Object";
    } else if (tool === EDITOR_MAP_TOOLS.PLACE_CHARACTER) {
        toolSelectData = characters;
        toolSelectName = "Character";
    } else if (tool === EDITOR_MAP_TOOLS.PLACE_ENEMY) {
        toolSelectData = enemies;
        toolSelectName = "Enemy";
    }

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
                        saveMap().then(() => {
                            // if new map, we just saved so reload it with the non-new-map context
                            if (newMap) {
                                navigate(`/editor/map/${map}`);
                            }
                        });
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
                <select value={tool} onChange={(e) => {
                    setTool(e.target.value)
                    setActiveItem('');
                }}>
                    <option value="">Select a tool</option>
                    {Object.keys(EDITOR_MAP_TOOLS).map((key) => {
                        return <option key={`tool_${key}`} value={EDITOR_MAP_TOOLS[key]}>{key}</option>
                    })}
                </select>
            </div>
            {toolSelectData && <div>
                <div>Selected Tile:</div>
                <select value={activeItem} onChange={(e) => setActiveItem(e.target.value)}>
                    <option value=''>Select a {toolSelectName}</option>
                    {Object.keys(toolSelectData).map((item) => {
                        const data = toolSelectData[item];

                        let text = item;
                        if (data.type) {
                            text += `(${data.type})`;
                        }

                        return <option key={`select_${toolSelectName}_${item}`} value={item}>{text}</option>
                    })}
                </select>
                <div>
                    <span>Remove Under</span>
                    <input type="checkbox" checked={removeUnder} onChange={(e) => setRemoveUnder(e.target.checked)} />
                </div>
            </div>}
        </div>
    );
}