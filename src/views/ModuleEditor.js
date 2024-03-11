import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import EditorContext from '../contexts/EditorContext';
import ImageContext from '../contexts/ImageContext';
import ModuleContext from '../contexts/ModuleContext';
import { TILE_TYPE } from '../contexts/MapContext';
import TextField from '../components/TextField';

export default function ModuleEditor() {
    const { loaded: editorLoaded, loadModule, module, saveModules } = useContext(EditorContext);
	const { loaded: moduleLoaded, tiles, changeTile, addTile } = useContext(ModuleContext);
    const { module: moduleId } = useParams();

    useEffect(() => {
        loadModule(moduleId);
    }, [moduleId]);

    const loaded = editorLoaded && moduleLoaded;

    return (
        <>
            {!loaded && (
                <div>
                    Loading
                </div>
            )}
            {loaded && (
                <div>
                    <div>Module: {module}</div>
                    <div>
                        <button onClick={() => {
                            saveModules();
                        }}>Save</button>
                    </div>
                    <div>Tiles:</div>
                    <div>
                        <table border={1}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type</th>
                                    <th>Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(tiles).map((id) => {
                                    const tile = tiles[id];

                                    const idWithoutModule = id.replace(module + "_", "");

                                    return (<tr key={`editor_tile_${id}`}>
                                        <td><TextField value={idWithoutModule} onBlur={(id) => {
                                            changeTile(module, idWithoutModule, "id", id);
                                        }} /></td>
                                        <td>
                                            <select defaultValue={tile.type} onChange={(e) => {
                                                changeTile(module, idWithoutModule, "type", e.target.value);
                                            }}>
                                                {Object.keys(TILE_TYPE).map((key) => {
                                                    return <option key={`option_${id}_type_${key}`} value={TILE_TYPE[key]}>{key}</option>
                                                })}
                                            </select>
                                        </td>
                                        <td><TextField value={tile.rawImage} onBlur={(value) => {
                                            changeTile(module, idWithoutModule, "rawImage", value);
                                        }} /></td>
                                    </tr>);
                                })}
                            </tbody>
                        </table>
                        <div>
                            <button onClick={() => {
                                addTile(module);
                            }}>New Tile</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}