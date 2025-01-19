import React, { useContext, useState } from 'react';
import SidebarNav from './SidebarNav';
import ModuleContext from '../contexts/ModuleContext';
import { getScripts } from '../data/moduleData';
import CodeEditor from './CodeEditor';

export default function ModuleScriptEditor({ module }) {
    const scripts = getScripts();
    const [activeScript, setActiveScript] = useState(null);
    const { updateScript, addScript } = useContext(ModuleContext);
    const modulePrefix = `${module}_`;

    return <div style={{
        display: 'flex',
    }}>
        <div>
            <h2>Scripts</h2>
            <SidebarNav
                items={Object.keys(scripts)}
                setActiveItem={setActiveScript}
                onNew={(name) => {
                    if (!name.endsWith(".js")) {
                        name += ".js";
                    }
                    addScript(module, modulePrefix + "scripts/" + name);
                }}
            />
        </div>
        {activeScript && <CodeEditor
            code={scripts[activeScript]}
            onChange={(code) => {
                updateScript(module, activeScript, code);
            }}
        />}
    </div>;
}