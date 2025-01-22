import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import EditorContext from '../contexts/EditorContext';
import ModuleContext from '../contexts/ModuleContext';
import ModuleTileEditor from '../components/ModuleTileEditor';
import TabBar from '../components/TabBar';
import ModuleObjectEditor from '../components/ModuleObjectEditor';
import ModuleEnemyEditor from '../components/ModuleEnemyEditor';
import ModuleScriptEditor from '../components/ModuleScriptEditor';
import ModuleCharacterEditor from '../components/ModuleCharacterEditor';
import SearchContext from '../contexts/SearchContext';

export default function ModuleEditor({ newModule }) {
    const { loaded: editorLoaded, loadModule, module, saveModules, createNewModule } = useContext(EditorContext);
	const { loaded: moduleLoaded } = useContext(ModuleContext);
    const { module: moduleId } = useParams();
    const navigate = useNavigate();
    const { changeSearch, search } = useContext(SearchContext);
    const [initialTab, setInitialTab] = useState('Characters');

    useEffect(() => {
        if (newModule) {
            createNewModule(moduleId);
        } else {
            loadModule(moduleId);
        }
    }, [moduleId]);

    useEffect(() => {
        if (search.tab) {
            setInitialTab(search.tab);
        }
    }, [search.tab])

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
                            window.location.reload();
                        }}>Save</button>
                        <button onClick={() => {
                            navigate("/editor/module/load");
                        }}>Back</button>
                    </div>
                </div>
                <TabBar
                    tabs={['Characters', 'Tiles', 'Objects', 'Enemies', 'Scripts']}
                    initialTab={initialTab}
                    onChange={(tab) => {
                        changeSearch('tab', tab);
                        changeSearch('entity', null);
                    }}
                >
                    <ModuleCharacterEditor module={module} />
                    <ModuleTileEditor module={module} />
                    <ModuleObjectEditor module={module} />
                    <ModuleEnemyEditor module={module} />
                    <ModuleScriptEditor module={module} />
                </TabBar>
            </>)}
        </>
    );
}