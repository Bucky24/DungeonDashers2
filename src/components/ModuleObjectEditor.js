import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './ModuleObjectEditor.css';

import ModuleContext from '../contexts/ModuleContext';
import TextField from './TextField';

export default function ModuleObjectEditor({ module }) {
    const { objects } = useContext(ModuleContext);
    const [activeObject, setActiveObject] = useState('');

    useEffect(() => {
        if (Object.keys(objects).length > 0 && !activeObject) {
            setActiveObject(Object.keys(objects)[0]);
        }
    }, [activeObject, objects]);

    return <section style={{ display: 'flex' }}>
        <aside style={{ flexShrink: 0, flexBasis: 200, marginRight: 20 }}>
            {Object.keys(objects).map((key) => {
                const object = objects[key];

                return <div
                    key={`object_${key}`}
                    className={classNames(
                        activeObject === key && styles.active,
                    )}
                    onClick={() => setActiveObject(key)}
                >{key}</div>
            })}
        </aside>
        {activeObject && objects[activeObject] && <div>
            <h2>Object {activeObject}</h2>
            <h3>General Properties</h3>
            <table border={1}>
                <tbody>
                    <tr>
                        <td>ID</td>
                        <td><TextField value={activeObject} /></td>
                    </tr>
                </tbody>
            </table>
            <h3>States</h3>
            <table border={1}>
                <thead>
                    <tr>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody>
                    {objects[activeObject].states.map((state) => {
                        
                        return <tr key={`object_state_${state}`}>
                            <td><TextField value={state} /></td>
                        </tr>
                    })}
                </tbody>
            </table>
            <h3>Images</h3>
            <table border={1}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Path</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(objects[activeObject].images).map((key) => {
                        const imageData = objects[activeObject].images[key];
                        
                        return <tr key={`object_image_${key}`}>
                            <td><TextField value={key} /></td>
                            <td><TextField value={imageData.rawPath} /></td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>}
    </section>
}