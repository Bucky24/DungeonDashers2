import React, { useContext, useState } from 'react';
import MapContext from '../contexts/MapContext';
import EditorContext from '../contexts/EditorContext';

export default function MapTriggerEditor() {
    const { triggers, updateTriggerEffect } = useContext(MapContext);
    const [activeTriggerId, setActiveTriggerId] = useState("");
    const { saveMap } = useContext(EditorContext);

    const activeTrigger = triggers[activeTriggerId];

    return <div style={{ display: 'flex' }}>
        <div style={{ flexShrink: 0 }}>
            <button onClick={saveMap}>save</button>
            {Object.keys(triggers).map((triggerId) => {
                return <div
                    key={`trigger_${triggerId}`}
                    onClick={() => setActiveTriggerId(triggerId)}
                    style={{
                        cursor: 'pointer',
                        border: activeTriggerId === triggerId ? '1px solid red' : '',
                    }}
                >{triggerId}</div>
            })}
        </div>
        {activeTrigger && <div style={{flexGrow: 1}}>
            <h2>{activeTriggerId}</h2>
            <h3>Effects</h3>
            {activeTrigger.effects?.map((effect, index) => {
                return <div key={`effect_${index}`}>
                    <textarea
                        style={{ width: 'calc(100% - 10px)', height: 300}}
                        onChange={(e) => {
                            updateTriggerEffect(activeTriggerId, index, {
                                type: 'script',
                                code: e.target.value,
                            });
                        }}
                        value={effect.code}
                    ></textarea>
                </div>
            })}
        </div>}
    </div>
}