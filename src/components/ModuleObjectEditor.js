import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './ModuleObjectEditor.css';

import ModuleContext from '../contexts/ModuleContext';
import TextField from './TextField';

export default function ModuleObjectEditor({ module }) {
    const { objects, changeObject } = useContext(ModuleContext);
    const [activeObject, setActiveObject] = useState('');

    useEffect(() => {
        if (Object.keys(objects).length > 0 && !activeObject) {
            setActiveObject(Object.keys(objects)[0]);
        }
    }, [activeObject, objects]);

    const modulePrefix = `${module}_`;
    const activeWithoutPrefix = activeObject.replace(modulePrefix, "");

    return <section style={{ display: 'flex' }}>
        <aside style={{ flexShrink: 0, flexBasis: 200, marginRight: 20 }}>
            {Object.keys(objects).map((key) => {
                return <div
                    key={`object_${key}`}
                    className={classNames(
                        activeObject === key && styles.active,
                    )}
                    onClick={() => setActiveObject(key)}
                >{key.replace(modulePrefix, "")}</div>
            })}
        </aside>
        {activeObject && objects[activeObject] && <div>
            <h2>Object {activeWithoutPrefix}</h2>
            <h3>General Properties</h3>
            <table border={1}>
                <tbody>
                    <tr>
                        <td>ID</td>
                        <td><TextField value={activeWithoutPrefix} onBlur={(newId) => {
                            changeObject(module, activeWithoutPrefix, "id", newId);
                            setActiveObject(modulePrefix + newId);
                        }} /></td>
                    </tr>
                    <tr>
                        <td>Manifest File</td>
                        <td><TextField value={objects[activeObject].manifest.manifest} onBlur={(newValue) => {
                            changeObject(module, activeWithoutPrefix, "manifest.manifest", newValue);
                        }} /></td>
                    </tr>
                </tbody>
            </table>
            <h3>States</h3>
            <table border={1}>
                <thead>
                    <tr>
                        <th>State</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {objects[activeObject].states.map((state, index) => {
                        
                        return <tr key={`object_state_${state}`}>
                            <td><TextField value={state} onBlur={(newValue) => {
                                changeObject(module, activeWithoutPrefix, `states.${index}`, newValue);
                            }}/></td>
                            <td>
                                <button onClick={() => {
                                    changeObject(module, activeWithoutPrefix, `states.${index}`, null);
                                }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
            <button onClick={() => {
                if (objects[activeObject].states.length === 0) {
                    changeObject(module, activeWithoutPrefix, `states`, []);
                } else {
                    changeObject(module, activeWithoutPrefix, `states.${objects[activeObject].states.length}`, '');
                }
            }}>Add State</button>
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