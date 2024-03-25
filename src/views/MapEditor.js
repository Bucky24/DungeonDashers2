import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import EditorContext from '../contexts/EditorContext';
import ModuleContext from '../contexts/ModuleContext';
import ImageContext from '../contexts/ImageContext';
import MapContext from '../contexts/MapContext';
import EditorMap from '../components/EditorMap';
import EditorControls from '../components/EditorControls';
import TabBar from '../components/TabBar';
import MapTriggerEditor from '../components/MapTriggerEditor';

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
                <TabBar tabs={["Map", "Triggers"]} defaultTab="Map">
                    <div style={{ position: 'relative' }}>
                        <EditorMap />
                        <EditorControls />
                    </div>
                    <MapTriggerEditor />
                </TabBar>
            )}
        </>
    );
}