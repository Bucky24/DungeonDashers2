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
                    </tbody>
                </table>
        </div>}
    </div>
}