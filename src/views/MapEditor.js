import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import EditorContext from '../contexts/EditorContext';
import ModuleContext from '../contexts/ModuleContext';
import ImageContext from '../contexts/ImageContext';
import MapContext from '../contexts/MapContext';
import EditorMap from '../components/EditorMap';
import EditorControls from '../components/EditorControls';

export default function MapEditor() {
    const { loaded: editorLoaded, loadMap } = useContext(EditorContext);
	const { loaded: moduleLoaded } = useContext(ModuleContext);
	const { loaded: imagesLoaded } = useContext(ImageContext);
    const { loaded: mapLoaded } = useContext(MapContext);
    const { map } = useParams();

	const loaded = editorLoaded && moduleLoaded && imagesLoaded && mapLoaded;

    useEffect(() => {
        loadMap(map);
    }, [map]);

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