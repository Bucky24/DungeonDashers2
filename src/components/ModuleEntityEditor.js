import React, { useContext, useEffect, useState } from 'react';

import SidebarNav from './SidebarNav';
import TextField from './TextField';
import { BASE_STATES } from '../contexts/MapContext';
import { processTemplate } from '../utils/processTemplate';
import SearchContext from '../contexts/SearchContext';

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
    extraImages,
}) {
    const [activeEntityKey, setActiveEntityKey] = useState('');
    const { changeSearch } = useContext(SearchContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const entity = params.get("entity");
        if (entity) {
            setActiveEntityKey(entity);
        }
    }, []);

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

    return <section>
        <h2>{name}</h2>
        <div style={{ display: 'flex', paddingBottom: 20 }}>
            <SidebarNav
                items={Object.keys(entities).map((key) => key.replace(modulePrefix, ""))}
                activeItem={activeEntityKey.replace(modulePrefix, "")}
                setActiveItem={(item) => {
                    const key = modulePrefix + item;
                    setActiveEntityKey(key);
                    changeSearch("entity", key);
                }}
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
                        <tr>
                            <td>Default State</td>
                            <td>
                                <select
                                    value={activeEntityData.defaultState || ''}
                                    onChange={(newData) => {
                                        changeEntity(module, activeEntityKey, "defaultState", newData.target.value);
                                    }}
                                >
                                    <option value="">None</option>
                                    {(activeEntityData.states || []).map((state) => {
                                        return <option key={`default_state_${state}`} value={state}>{state}</option>
                                    })}
                                </select>
                            </td>
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
                <h3>Flags</h3>
                <table border={1}>
                    <thead>
                        <tr>
                            <th>Flag</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(activeEntityData.flags || []).map((flag, index) => {
                            return <tr key={`entity_flag_${flag}`}>
                                <td><TextField value={flag} onBlur={(newValue) => {
                                    changeEntity(module, activeEntityKey, `flags.${index}`, newValue);
                                }}/></td>
                                <td>
                                    <button onClick={() => {
                                        changeEntity(module, activeEntityKey, `flags.${index}`, null);
                                    }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <button onClick={() => {
                    const newFlags = [...activeEntityData.flags || []];
                    newFlags.push("");
                    changeEntity(module, activeEntityKey, `flags`, newFlags);
                }}>Add Flag</button>
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
                        {extraImages && extraImages.map((image) => {
                            const realImageKey = processTemplate(image, {
                                id: keyWithoutPrefix,
                            });

                            const imageData = activeEntityData.images[realImageKey] || {};
                            
                            return <tr key={`entity_image_${realImageKey}`}>
                                <td>{realImageKey}</td>
                                <td>
                                    <TextField
                                        value={imageData.rawPath || ''}
                                        onBlur={(newData) => changeEntity(module, activeEntityKey, `images.${realImageKey}`, {
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
                <h3>Sounds</h3>
                <table border={1}>
                    <tbody>
                        {Object.keys(activeEntityData.sounds).map((key) => {
                            const sound = activeEntityData.sounds[key].file;
                            return <tr key={`sound_${key}`}>
                                <td>
                                    <TextField
                                        value={key}
                                        onBlur={(newData) => {
                                            const newSounds = {...activeEntityData.sounds};
                                            newSounds[newData] = newSounds[key];
                                            delete newSounds[key];
                                            changeEntity(module, activeEntityKey, `sounds`, newSounds);
                                        }}
                                    />
                                </td>
                                <td>
                                    <TextField
                                        value={sound}
                                        onBlur={(newData) => {
                                            const newSounds = {...activeEntityData.sounds};
                                            newSounds[key].file = newData
                                            changeEntity(module, activeEntityKey, `sounds`, newSounds);
                                        }}
                                    />
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <button onClick={() => {
                    const newSounds = {...activeEntityData.sounds};
                    newSounds["unnamed"] = { file: 'main_unnamed'};
                    changeEntity(module, activeEntityKey, `sounds`, newSounds);
                }}>Add Sound</button>
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
                <h3>Slots</h3>
                <table border={1}>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeEntityData.slots?.map((slot, index) => {
                            return <tr>
                                <td>
                                    <TextField
                                        value={slot.type}
                                        onBlur={(newData) => {
                                            const newSlots = [...activeEntityData.slots];
                                            newSlots[index].type = newData;
                                            changeEntity(module, activeEntityKey, `slots`, newSlots);
                                        }}
                                    />
                                </td>
                                <td>
                                    <TextField
                                        value={slot.name}
                                        onBlur={(newData) => {
                                            const newSlots = [...activeEntityData.slots];
                                            newSlots[index].name = newData;
                                            changeEntity(module, activeEntityKey, `slots`, newSlots);
                                        }}
                                    />
                                </td>
                                <td>
                                    <button onClick={() => {
                                        const newSlots = [...activeEntityData.slots];
                                        newSlots.splice(index, 1);
                                        changeEntity(module, activeEntityKey, `slots`, newSlots);
                                    }}>Remove</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <button onClick={() => {
                    const newSlots = [...activeEntityData.slots || []];
                    newSlots.push({
                        type: '',
                        name: '',
                    });
                    changeEntity(module, activeEntityKey, `slots`, newSlots);
                }}>Add Slot</button>
            </div>}
        </div>
    </section>;
}