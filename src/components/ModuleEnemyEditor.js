import React, { useContext } from 'react';

import ModuleContext from '../contexts/ModuleContext';
import ModuleEntityEditor from './ModuleEntityEditor';

export default function ModuleEnemyEditor({ module }) {
    const { enemies, addEnemy, changeEnemy } = useContext(ModuleContext);

    return <ModuleEntityEditor
        entities={enemies}
        module={module}
        createEntity={addEnemy}
        name="Enemy"
        changeEntity={changeEnemy}
        hasAi={true}
        canFight={true}
    />;
}