import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import EditorContext from '../contexts/EditorContext';
import ModuleContext from '../contexts/ModuleContext';
import ImageContext from '../contexts/ImageContext';
import MapContext from '../contexts/MapContext';
import EditorMap from '../components/EditorMap';
import EditorControls from '../components/EditorControls';
import TabBar from '../components/TabBar';
import MapTriggerEditor from '../components/MapTriggerEditor';
import MapEntityEditor from '../components/MapEntityEditor';

export default function MapEditor({ newMap }) {
    const { loaded: editorLoaded, loadMap, createNewMap, selectedCell } = useContext(EditorContext);
	const { loaded: moduleLoaded } = useContext(ModuleContext);
	const { loaded: imagesLoaded } = useContext(ImageContext);
    const { loaded: mapLoaded, entitiesAtPosition } = useContext(MapContext);
    const { map } = useParams();
    const navigate = useNavigate();

	const loaded = editorLoaded && moduleLoaded && imagesLoaded && mapLoaded;

    useEffect(() => {
        if (map) {
            if (newMap) {
                createNewMap(map);
            } else {
                loadMap(map);
            }
        }
    }, [map, newMap]);

    const positionalEntities = selectedCell ? entitiesAtPosition(selectedCell.x, selectedCell.y) : [];

    return (
        <>
            {!loaded && (
                <div>
                    Loading
                </div>
            )}
            {loaded && (<>
                <button onClick={() => navigate("/editor/map")}>Back</button>
                <TabBar tabs={["Map", "Triggers"]} defaultTab="Map">
                    <div style={{ position: 'relative' }}>
                        <EditorMap />
                        <EditorControls newMap={newMap} />
                        {positionalEntities.length > 0 && (<div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            backgroundColor: "#fff",
                            height: '100vh',
                            minWidth: 300,
                        }}>
                            Selected {selectedCell.x}, {selectedCell.y}
                            {positionalEntities.map((entity, index) => {
                                return <MapEntityEditor key={`entity_${index}`} entity={entity} />
                            })}
                        </div>)}
                    </div>
                    <MapTriggerEditor />
                </TabBar>
            </>)}
        </>
    );
}