import React, { useContext } from 'react';

import ModuleContext from '../contexts/ModuleContext';
import ModuleEntityEditor from './ModuleEntityEditor';

export default function ModuleObjectEditor({ module }) {
    const { objects, changeObject, addObject } = useContext(ModuleContext);

    return <ModuleEntityEditor
        entities={objects}
        module={module}
        createEntity={addObject}
        name="Object"
        changeEntity={changeObject}
    />
}