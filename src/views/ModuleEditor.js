import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import EditorContext from '../contexts/EditorContext';
import ImageContext from '../contexts/ImageContext';
import ModuleContext from '../contexts/ModuleContext';

export default function ModuleEditor() {
    const { loaded: editorLoaded, loadModule, module } = useContext(EditorContext);
	const { loaded: moduleLoaded, tiles } = useContext(ModuleContext);
    const { fullImages } = useContext(ImageContext);
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
            {loaded && (
                <div>
                    <div>Module: {module}</div>
                    <div>Tiles:</div>
                    <div>
                        <table border={1}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type</th>
                                    <th>Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(tiles).map((id) => {
                                    const tile = tiles[id];

                                    const idWithoutModule = id.replace(module + "_", "");

                                    return (<tr>
                                        <td>{idWithoutModule}</td>
                                        <td>{tile.type}</td>
                                        <td>{tile.rawImage}</td>
                                    </tr>);
                                })}
                            </tbody>
                        </table>
                    
                    </div>
                </div>
            )}
        </>
    );
}