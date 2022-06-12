import React, { useContext, useEffect } from 'react';

import EditorContext from '../contexts/EditorContext';
import ModuleContext from '../contexts/ModuleContext';
import ImageContext from '../contexts/ImageContext';
import MapContext from '../contexts/MapContext';
import EditorMap from './EditorMap';
import EditorControls from './EditorControls';

export default function Editor() {
    const { loaded: editorLoaded, loadMap } = useContext(EditorContext);
	const { loaded: moduleLoaded } = useContext(ModuleContext);
	const { loaded: imagesLoaded } = useContext(ImageContext);
    const { loaded: mapLoaded } = useContext(MapContext);

    useEffect(() => {
		loadMap('map1', true);
	}, []);

	const loaded = editorLoaded && moduleLoaded && imagesLoaded && mapLoaded;

    return (
        <>
            {!loaded && (
                <div>
                    Loading
                </div>
            )}
            {loaded && (
                <>
                    <EditorMap />
                    <EditorControls />
                </>
            )}
        </>
    );
}