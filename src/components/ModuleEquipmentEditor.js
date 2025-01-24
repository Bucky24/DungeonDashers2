import React, { useContext, useState } from 'react';

import ModuleContext from '../contexts/ModuleContext';
import ModuleEntityEditor from './ModuleEntityEditor';
import { getEquipment } from '../data/moduleData';
import SidebarNav from './SidebarNav';

export default function ModuleEquipmentEditor({ module }) {
    const equipment = getEquipment();
    const { changeObject, addEquipment } = useContext(ModuleContext);
    const [activeEquipment, setActiveEquipment] = useState();

    const modulePrefix = `${module}_`;

    return <div style={{ display: 'flex' }}>
        <div>
            <h2>Equipment</h2>
            <SidebarNav
                items={Object.keys(equipment).map((key) => key.replace(modulePrefix, ""))}
                setActiveItem={(item) => {
                    setActiveEquipment(modulePrefix + item);
                }}
                onNew={(name) => {
                    addEquipment(module, modulePrefix + name);
                }}
            />
        </div>
    </div>
}