import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import EditorContext from '../contexts/EditorContext';
import ModuleContext from '../contexts/ModuleContext';
import ModuleTileEditor from '../components/ModuleTileEditor';

export default function ModuleEditor() {
    const { loaded: editorLoaded, loadModule, module, saveModules } = useContext(EditorContext);
	const { loaded: moduleLoaded, tiles, changeTile, addTile } = useContext(ModuleContext);
    const { module: moduleId } = useParams();

    useEffect(() => {
        loadModule(moduleId);
    }, [moduleId]);

    const loaded = editorLoaded && moduleLoaded;

    return (
        <>
            {!loaded && (
                <div>
                    Loading
                </div>
            )}
            {loaded && (<>
                <div>
                    <div>Module: {module}</div>
                    <div>
                        <button onClick={() => {
                            saveModules();
                        }}>Save</button>
                    </div>
                </div>
                <ModuleTileEditor module={module} />
            </>)}
        </>
    );
}