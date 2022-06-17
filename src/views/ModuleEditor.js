import React, { useContext, useEffect } from 'react';

import EditorContext from '../contexts/EditorContext';
import ImageContext from '../contexts/ImageContext';
import ModuleContext from '../contexts/ModuleContext';

export default function ModuleEditor() {
    const { loaded: editorLoaded, loadModule, module } = useContext(EditorContext);
	const { loaded: moduleLoaded, tiles } = useContext(ModuleContext);
    const { fullImages } = useContext(ImageContext);

    useEffect(() => {
        loadModule('main');
    }, []);

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
                    {Object.keys(tiles).map((id) => {
                        const tile = tiles[id];
                        const imageData = fullImages[tile.image];

                        const idWithoutModule = id.replace(module + "_", "");

                        return (<div>
                            id: {idWithoutModule}
                            Type: {tile.type}
                            {imageData && (
                                <>
                                    url: {imageData.url}
                                </>
                            )}
                        </div>);
                    })}
                    </div>
                </div>
            )}
        </>
    );
}