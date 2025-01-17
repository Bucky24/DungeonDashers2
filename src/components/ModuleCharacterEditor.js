import React, { useContext } from 'react';

import ModuleContext from '../contexts/ModuleContext';
import ModuleEntityEditor from './ModuleEntityEditor';
import { getCharacters } from '../data/moduleData';

export default function ModuleCharacterEditor({ module }) {
    const { addCharacter, changeCharacter } = useContext(ModuleContext);

    return <ModuleEntityEditor
        entities={getCharacters()}
        module={module}
        createEntity={addCharacter}
        name="Character"
        changeEntity={changeCharacter}
        hasAi={true}
        canFight={true}
    />;
}