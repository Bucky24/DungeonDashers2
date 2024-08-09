import React, { useContext } from 'react';

import ModuleContext from '../contexts/ModuleContext';
import ModuleEntityEditor from './ModuleEntityEditor';
import { getObjects } from '../data/moduleData';

export default function ModuleObjectEditor({ module }) {
    const { changeObject, addObject } = useContext(ModuleContext);

    return <ModuleEntityEditor
        entities={getObjects()}
        module={module}
        createEntity={addObject}
        name="Object"
        changeEntity={changeObject}
    />
}