import React, { useState } from 'react';

import SidebarNav from './SidebarNav';
import TextField from './TextField';
import { BASE_STATES } from '../contexts/MapContext';

const GENERAL_FIELDS = [
    { key: 'name', name: 'Name' },
    { key: 'width', name: 'Width' },
    { key: 'height', name: 'Height' },
];

const GENERAL_COMBAT_FIELDS = [
    { key: 'actionPoints', name: 'Action Points' },
    { key: 'maxHP', name: 'Max HP' },
];

export default function ModuleEntityEditor({
    entities,
    module,
    createEntity,
    name,
    changeEntity,
    canFight,
    hasAi,
}) {
    const [activeEntityKey, setActiveEntityKey] = useState('');

    const modulePrefix = `${module}_`;

    const activeEntityData = entities[activeEntityKey];
    const keyWithoutPrefix = activeEntityKey.replace(modulePrefix, "");

    const generateField = (field) => {
        return <tr key={field.key}>
            <td>{field.name}</td>
            <td><TextField value={activeEntityData[field.key] || ''} onBlur={(newValue) => {
                changeEntity(module, activeEntityKey, field.key, newValue);
            }} /></td>
        </tr>
    }

    return <section style={{ display: 'flex' }}>
        <SidebarNav
            items={Object.keys(entities).map((key) => key.replace(modulePrefix, ""))}
            activeItem={activeEntityKey.replace(modulePrefix, "")}
            setActiveItem={(item) => setActiveEntityKey(modulePrefix + item)}
            onNew={(name) => {
                createEntity(module, modulePrefix + name);
            }}
        />
        {activeEntityData && <div>
            <h2>{name} {keyWithoutPrefix}</h2>
            <h3>General Properties</h3>
            <table border={1}>
                <tbody>
                    <tr>
                        <td>ID</td>
                        <td><TextField value={keyWithoutPrefix} onBlur={(newId) => {
                            changeEntity(module, activeEntityKey, "id", modulePrefix + newId);
                            setActiveEntityKey(modulePrefix + newId);
                        }} /></td>
                    </tr>
                    <tr>
                        <td>Manifest File</td>
                        <td><TextField value={activeEntityData.manifest.manifest} onBlur={(newValue) => {
                            changeEntity(module, activeEntityKey, "manifest.manifest", newValue);
                        }} /></td>
                    </tr>
                    {GENERAL_FIELDS.map(generateField)}
                    {canFight && GENERAL_COMBAT_FIELDS.map(generateField)}
                    {hasAi && <tr>
                        <td>AI Script</td>
                        <td>
                            <select
                                value={activeEntityData.skills?.ai?.file}
                                onChange={(newData) => {
                                    changeEntity(module, activeEntityKey, "skills.ai", {
                                        type: 'script',
                                        file: newData.target.value,
                                    });
                                }}
                            >
                                <option value="">None</option>
                                {Object.keys(activeEntityData.scripts).map((script) => {
                                    return <option key={`ai_dropdown_${script}`} value={script}>{script}</option>
                                })}
                            </select>
                        </td>
                    </tr>}
                </tbody>
            </table>
            <h3>States</h3>
            <table border={1}>
                <thead>
                    <tr>
                        <th>State</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(activeEntityData.states || []).map((state, index) => {
                        return <tr key={`entity_state_${state}`}>
                            <td><TextField value={state} onBlur={(newValue) => {
                                changeEntity(module, activeEntityKey, `states.${index}`, newValue);
                            }}/></td>
                            <td>
                                <button onClick={() => {
                                    changeEntity(module, activeEntityKey, `states.${index}`, null);
                                }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
            <button onClick={() => {
                const newStates = [...activeEntityData.states || []];
                newStates.push("");
                changeEntity(module, activeEntityKey, `states`, newStates);
            }}>Add State</button>
            <h3>Images</h3>
            <table border={1}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Path</th>
                    </tr>
                </thead>
                <tbody>
                    {canFight && Object.values(BASE_STATES).map((state) => {
                        return <tr key={`entity_image_${state}`}>
                            <td>{state}</td>
                            <td>
                                <TextField
                                    value={activeEntityData.images?.[state]?.image || ''}
                                    onBlur={(newData) => changeEntity(module, activeEntityKey, `images.${state}.image`, newData)}
                                />
                            </td>
                        </tr>
                    })}
                    {(activeEntityData.states || []).map((key) => {
                        const imageData = activeEntityData.images[key] || {};
                        
                        return <tr key={`entity_image_${key}`}>
                            <td>{key}</td>
                            <td>
                                <TextField
                                    value={imageData.rawPath || ''}
                                    onBlur={(newData) => changeEntity(module, activeEntityKey, `images.${key}`, {
                                        image: modulePrefix + newData,
                                        rawImage: newData,
                                    })}
                                />
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
            <h3>Scripts</h3>
            <table border={1}>
                <tbody>
                    {Object.keys(activeEntityData.scripts).map((script, index) => {
                        return <tr key={`script_${index}`}>
                            <td>
                                <TextField
                                    value={script}
                                    onBlur={(newData) => {
                                        const newScripts = {...activeEntityData.scripts};
                                        newScripts[newData] = newScripts[script];
                                        newScripts[newData].script = modulePrefix + newData;
                                        delete newScripts[script];
                                        changeEntity(module, activeEntityKey, `scripts`, newScripts);
                                    }}
                                />
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
            <button onClick={() => {
                const newScripts = {...activeEntityData.scripts};
                newScripts["unnamed"] = { script: 'main_unnamed'};
                changeEntity(module, activeEntityKey, `scripts`, newScripts);
            }}>Add Script</button>
            <h3>Events</h3>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Script</th>
                    </tr>
                </thead>
                <tbody>
                    {(activeEntityData.events || []).map((event, index) => {
                        return <tr key={`event_${index}`}>
                            <td>
                                <TextField
                                    value={event.on || ''}
                                    onBlur={(newData) => {
                                        changeEntity(module, activeEntityKey, `events.${index}.on`, newData);
                                    }}
                                />
                            </td>
                            <td>
                                <select
                                    value={event.file}
                                    onChange={(newData) => {
                                        changeEntity(module, activeEntityKey, `events.${index}`, {
                                            ...event,
                                            type: 'script',
                                            file: newData.target.value,
                                        });
                                    }}
                                >
                                    <option value="">None</option>
                                    {Object.keys(activeEntityData.scripts).map((script) => {
                                        return <option key={`event_dropdown_${index}_${script}`} value={script}>{script}</option>
                                    })}
                                </select>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
            <button onClick={() => {
                const newEvents = [...activeEntityData.events || []];
                newEvents.push({});
                changeEntity(module, activeEntityKey, `events`, newEvents);
            }}>Add Event Handler</button>
        </div>}
    </section>;
}