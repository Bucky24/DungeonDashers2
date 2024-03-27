import React, { useContext, useState } from 'react';

import ModuleContext, { BASE_STATES } from '../contexts/ModuleContext';
import SidebarNav from './SidebarNav';
import TextField from './TextField';

export default function ModuleEnemyEditor({ module }) {
    const { enemies, addEnemy, changeEnemy } = useContext(ModuleContext);
    const [activeEnemy, setActiveEnemy] = useState('main_skeleton1');

    const modulePrefix = `${module}_`;

    const activeEnemyData = enemies[activeEnemy] || null;

    console.log(activeEnemyData)

    return <section style={{ display: 'flex' }}>
        <SidebarNav
            items={Object.keys(enemies).map((key) => key.replace(modulePrefix, ""))}
            activeItem={activeEnemy.replace(modulePrefix, "")}
            setActiveItem={(item) => setActiveEnemy(modulePrefix + item)}
            onNew={(name) => {
                addEnemy(module, modulePrefix + name);
            }}
        />
        {activeEnemyData && <div>
            {activeEnemy && <div>
                <h2>Enemy {activeEnemy.replace(modulePrefix, "")}</h2>
            </div>}
            <h3>General Properties</h3>
            <table border={1}>
                <tbody>
                    <tr>
                        <td>ID</td>
                        <td>
                            <TextField
                                value={activeEnemyData.id.replace(modulePrefix, "")}
                                onBlur={(id) => {
                                    changeEnemy(module, activeEnemy, "id", modulePrefix + id);
                                    setActiveEnemy(modulePrefix + id);
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Manifest File</td>
                        <td>
                            <TextField
                                value={activeEnemyData.manifest.manifest || ''}
                                onBlur={(newData) => {
                                    changeEnemy(module, activeEnemy, "manifest.manifest", newData);
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Name</td>
                        <td>
                            <TextField
                                value={activeEnemyData.name || ''}
                                onBlur={(newData) => {
                                    changeEnemy(module, activeEnemy, "name", newData);
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Width</td>
                        <td>
                            <TextField
                                value={activeEnemyData.width || ''}
                                onBlur={(newData) => {
                                    changeEnemy(module, activeEnemy, "width", parseInt(newData));
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Height</td>
                        <td>
                            <TextField
                                value={activeEnemyData.height || ''}
                                onBlur={(newData) => {
                                    changeEnemy(module, activeEnemy, "height", parseInt(newData));
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Action Points</td>
                        <td>
                            <TextField
                                value={activeEnemyData.actionPoints || ''}
                                onBlur={(newData) => {
                                    changeEnemy(module, activeEnemy, "actionPoints", parseInt(newData));
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Max HP</td>
                        <td>
                            <TextField
                                value={activeEnemyData.maxHP || ''}
                                onBlur={(newData) => {
                                    changeEnemy(module, activeEnemy, "maxHP", parseInt(newData));
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>AI Script</td>
                        <td>
                            <select
                                value={activeEnemyData.skills?.ai?.file}
                                onChange={(newData) => {
                                    changeEnemy(module, activeEnemy, "skills.ai", {
                                        type: 'script',
                                        file: newData.target.value,
                                    });
                                }}
                            >
                                <option value="">None</option>
                                {Object.keys(activeEnemyData.scripts).map((script) => {
                                    return <option key={`ai_dropdown_${script}`} value={script}>{script}</option>
                                })}
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
            <h3>Images</h3>
            <table border={1}>
                <tbody>
                    {Object.values(BASE_STATES).map((state) => {
                        return <tr key={`image_${state}`}>
                            <td>{state}</td>
                            <td>
                                <TextField
                                    value={activeEnemyData.images?.[state]?.image || ''}
                                    onBlur={(newData) => changeEnemy(module, activeEnemy, `images.${state}.image`, newData)}
                                />
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
            <h3>Scripts</h3>
            <table border={1}>
                <tbody>
                    {Object.keys(activeEnemyData.scripts).map((script, index) => {
                        return <tr key={`script_${index}`}>
                            <td>
                                <TextField
                                    value={script}
                                    onBlur={(newData) => {
                                        const newScripts = {...activeEnemyData.scripts};
                                        newScripts[newData] = newScripts[script];
                                        newScripts[newData].script = modulePrefix + newData;
                                        delete newScripts[script];
                                        changeEnemy(module, activeEnemy, `scripts`, newScripts);
                                    }}
                                />
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
            <button onClick={() => {
                const newScripts = {...activeEnemyData.scripts};
                newScripts["unnamed"] = { script: 'main_unnamed'};
                changeEnemy(module, activeEnemy, `scripts`, newScripts);
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
                    {(activeEnemyData.events || []).map((event, index) => {
                        return <tr key={`event_${index}`}>
                            <td>
                                <TextField
                                    value={event.on || ''}
                                    onBlur={(newData) => {
                                        changeEnemy(module, activeEnemy, `events.${index}.on`, newData);
                                    }}
                                />
                            </td>
                            <td>
                                <select
                                    value={event.file}
                                    onChange={(newData) => {
                                        changeEnemy(module, activeEnemy, `events.${index}.file`, {
                                            type: 'script',
                                            file: newData.target.value,
                                        });
                                    }}
                                >
                                    <option value="">None</option>
                                    {Object.keys(activeEnemyData.scripts).map((script) => {
                                        return <option key={`event_dropdown_${index}_${script}`} value={script}>{script}</option>
                                    })}
                                </select>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
            <button onClick={() => {
                const newEvents = [...activeEnemyData.events || []];
                newEvents.push({});
                changeEnemy(module, activeEnemy, `events`, newEvents);
            }}>Add Event Handler</button>
        </div>}
    </section>
}