import React, { useContext, useState } from 'react';
import SidebarNav from './SidebarNav';
import ModuleContext from '../contexts/ModuleContext';
import { getScripts } from '../data/moduleData';
import CodeEditor from './CodeEditor';

export default function ModuleScriptEditor({ module }) {
    const scripts = getScripts();
    const [activeScript, setActiveScript] = useState(null);
    const { updateScript } = useContext(ModuleContext);

    return <div style={{
        display: 'flex',
    }}>
        <div>
            <h2>Scripts</h2>
            <SidebarNav
                items={Object.keys(scripts)}
                setActiveItem={setActiveScript}
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