import React, { useContext } from 'react';

import ModuleContext from '../contexts/ModuleContext';
import { TILE_TYPE } from '../contexts/MapContext';
import TextField from '../components/TextField';

export default function ModuleTileEditor({ module }) {
    const { tiles, changeTile, addTile } = useContext(ModuleContext);

    return <section>
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
                            <td><TextField value={idWithoutModule} onBlur={(newId) => {
                                changeTile(module, id, "id", module + "_" + newId);
                            }} /></td>
                            <td>
                                <select defaultValue={tile.type} onChange={(e) => {
                                    changeTile(module, id, "type", e.target.value);
                                }}>
                                    {Object.keys(TILE_TYPE).map((key) => {
                                        return <option key={`option_${id}_type_${key}`} value={TILE_TYPE[key]}>{key}</option>
                                    })}
                                </select>
                            </td>
                            <td><TextField value={tile.rawImage} onBlur={(value) => {
                                changeTile(module, id, "rawImage", value);
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
    </section>
}