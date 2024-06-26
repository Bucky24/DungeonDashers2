import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import EditorContext from '../contexts/EditorContext';
import ModuleContext from '../contexts/ModuleContext';
import ModuleTileEditor from '../components/ModuleTileEditor';
import TabBar from '../components/TabBar';
import ModuleObjectEditor from '../components/ModuleObjectEditor';
import ModuleEnemyEditor from '../components/ModuleEnemyEditor';

export default function ModuleEditor({ newModule }) {
    const { loaded: editorLoaded, loadModule, module, saveModules, createNewModule } = useContext(EditorContext);
	const { loaded: moduleLoaded, tiles, changeTile, addTile } = useContext(ModuleContext);
    const { module: moduleId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (newModule) {
            createNewModule(moduleId);
        } else {
            loadModule(moduleId);
        }
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
                        <button onClick={() => {
                            navigate("/editor/module/load");
                        }}>Back</button>
                    </div>
                </div>
                <TabBar tabs={['Tiles', 'Objects', 'Enemies']} defaultTab='Objects'>
                    <ModuleTileEditor module={module} />
                    <ModuleObjectEditor module={module} />
                    <ModuleEnemyEditor module={module} />
                </TabBar>
            </>)}
        </>
    );
}