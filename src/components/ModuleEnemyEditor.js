import React, { useContext } from 'react';

import ModuleContext from '../contexts/ModuleContext';
import ModuleEntityEditor from './ModuleEntityEditor';
import { getEnemies } from '../data/moduleData';

export default function ModuleEnemyEditor({ module }) {
    const { addEnemy, changeEnemy } = useContext(ModuleContext);

    return <ModuleEntityEditor
        entities={getEnemies()}
        module={module}
        createEntity={addEnemy}
        name="Enemy"
        changeEntity={changeEnemy}
        hasAi={true}
        canFight={true}
    />;
}