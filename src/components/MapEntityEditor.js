import React, { useContext } from "react";
import MapContext from "../contexts/MapContext";
import TextArea from "./TextArea";

export default function MapEntityEditor({ entity }) {
    const { updateObject } = useContext(MapContext);

    return <div>
        <h3>{entity.type} of type {entity.entity.type}</h3>
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
                </tbody>
            </table>
        </div>}
    </div>
}