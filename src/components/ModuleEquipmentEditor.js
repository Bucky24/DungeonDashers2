import React, { useContext, useEffect, useState } from 'react';

import ModuleContext from '../contexts/ModuleContext';
import { getEquipment } from '../data/moduleData';
import SidebarNav from './SidebarNav';
import TextField from './TextField';
import SearchContext from '../contexts/SearchContext';

export default function ModuleEquipmentEditor({ module }) {
    const equipment = getEquipment();
    const { changeEquipment, addEquipment } = useContext(ModuleContext);
    const [activeEquipment, setActiveEquipment] = useState('');
    const { changeSearch, search } = useContext(SearchContext);

    useEffect(() => {
        if (search.equipment) {
            setActiveEquipment(modulePrefix + search.equipment);
        }
    }, [search.equipment]);

    const modulePrefix = `${module}_`;
    const keyWithoutPrefix = activeEquipment.replace(modulePrefix, "");

    const activeEquipmentData = activeEquipment && equipment[activeEquipment];

    return <div style={{ display: 'flex' }}>
        <div>
            <h2>Equipment</h2>
            <SidebarNav
                items={Object.keys(equipment).map((key) => key.replace(modulePrefix, ""))}
                setActiveItem={(item) => {
                    setActiveEquipment(modulePrefix + item);
                    changeSearch("equipment", item);
                }}
                onNew={(name) => {
                    addEquipment(module, modulePrefix + name);
                }}
            />
        </div>
        {activeEquipmentData && <div>
            <h2>Equipment {keyWithoutPrefix}</h2>
            <h3>General Properties</h3>
            <table border={1}>
                <tbody>
                    <tr>
                        <td>ID</td>
                        <td><TextField value={keyWithoutPrefix} onBlur={(newId) => {
                            changeEquipment(module, activeEquipment, "id", modulePrefix + newId);
                            setActiveEquipment(modulePrefix + newId);
                            changeSearch("equipment", modulePrefix + newId);
                        }} /></td>
                    </tr>
                    <tr>
                        <td>Manifest File</td>
                        <td><TextField value={activeEquipmentData.manifest.manifest} onBlur={(newValue) => {
                            changeEquipment(module, activeEquipment, "manifest.manifest", newValue);
                        }} /></td>
                    </tr>
                    <tr>
                        <td>Main Image</td>
                        <td><TextField value={activeEquipmentData.mainImage.image} onBlur={(newValue) => {
                            changeEquipment(module, activeEquipment, "mainImage.image", newValue);
                        }} /></td>
                    </tr>
                </tbody>
            </table>
            <h3>Stats</h3>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Stat</th>
                        <th>Operator</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activeEquipmentData.stats.map((stat) => {
                        return <tr>
                            <td>
                                <select value={stat.stat}>
                                    <option value="maxHp">Max HP</option>
                                    <option value="actionPoints">Action Points</option>
                                </select>
                            </td>
                            <td>
                                <select value={stat.operator}>
                                    <option value="INCREASE">Increase</option>
                                    <option value="DECREASE">Decrease</option>
                                </select>
                            </td>
                            <td>
                                <div>Value type:</div>
                                <select value={stat.value.type}>
                                    <option value="CONST">Constant</option>
                                </select>
                                <div>Data</div>
                                <TextField value={stat.value.data} />
                            </td>
                            <th>
                                <button>X</button>
                            </th>
                        </tr>
                    })}
                </tbody>
            </table>
            <button onClick={() => {
                const newStats = [...activeEquipmentData.stats || []];
                newStats.push({
                    stat: 'maxHp',
                    operator: 'INCREASE',
                    value: {
                        type: 'CONST',
                        data: 10,
                    },
                });
                changeEquipment(module, activeEquipment, "stats", newStats);
            }}>Add Stat</button>
        </div>}
    </div>
}