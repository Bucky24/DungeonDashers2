import React, { useContext, useState } from "react";
import MapContext from "../contexts/MapContext";
import TextArea from "./TextArea";
import TextField from "./TextField";

export default function MapEntityEditor({ entity }) {
    const { updateObject } = useContext(MapContext);
    const [newFlag, setNewFlag] = useState('');

    return <div>
        <h3>{entity.type} of type {entity.entity.type} with id {entity.entity.id}</h3>
        {entity.type === "object" && <div>
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
                                    updateObject(entity.entity.id, "data", JSON.parse(value));
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
                                                    const newFlags = [...entity.entity.flags];
                                                    newFlags.splice(index, 1);
                                                    updateObject(entity.entity.id, "flags", newFlags);
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
                                                updateObject(entity.entity.id, "flags", [
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
        </div>}
    </div>
}