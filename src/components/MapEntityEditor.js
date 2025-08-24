import React, { useContext, useState } from "react";
import MapContext from "../contexts/MapContext";
import TextArea from "./TextArea";
import TextField from "./TextField";

export default function MapEntityEditor({ entity }) {
    const { updateObject, updateEnemy, updateCharacter } = useContext(MapContext);
    const [newFlag, setNewFlag] = useState('');

    let updateFunc;
    if (entity.type === 'object') updateFunc = updateObject;
    if (entity.type === 'enemy') updateFunc = updateEnemy;
    if (entity.type === "character") updateFunc = updateCharacter;

    let id = entity.entity.id;
    if (entity.type === "character") {
        id = entity.entity.type;
    }

    return <div>
        <h3>{entity.type} of type {entity.entity.type} with id {id}</h3>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Data</td>
                        <td>
                            <TextArea
                                value={JSON.stringify(entity.entity.data || {})}
                                onBlur={(value) => {
                                    updateFunc(entity.entity.id, "data", JSON.parse(value));
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Flags</td>
                        <td>
                            <table>
                                <tbody>
                                    {(entity.entity.flags || []).map((flag, index) => {
                                        return <tr key={`entity_flag_${flag}_${index}`}>
                                            <td>{flag}</td>
                                            <td>
                                                <button onClick={() => {
                                                    const newFlags = [...entity.entity.flags || []];
                                                    newFlags.splice(index, 1);
                                                    updateFunc(entity.entity.id, "flags", newFlags);
                                                }}>X</button>
                                            </td>
                                        </tr>
                                    })}
                                    <tr>
                                        <td>
                                            <TextField value={newFlag} onBlur={setNewFlag} />
                                        </td>
                                        <td>
                                            <button onClick={() => {
                                                updateFunc(id, "flags", [
                                                    ...entity.entity.flags || [],
                                                    newFlag,
                                                ]);
                                                setNewFlag('');
                                            }}>
                                                Add
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
}