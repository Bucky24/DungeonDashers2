import React, { useContext } from 'react';
import { ButtonTypes } from '@bucky24/react-canvas';

import TheMap from './TheMap';
import MapContext from '../contexts/MapContext';
import EditorContext, { EDITOR_MAP_TOOLS} from '../contexts/EditorContext';

export default function EditorMap() {
    const { map, setTile, objects } = useContext(MapContext);
    const { setHoveredEntities, activeTile, tool } = useContext(EditorContext);

    return (
        <TheMap
            map={map}
            objects={objects}
            onClick={(cellX, cellY, button) => {
                //console.log(cellX, cellY, button);
                if (button === ButtonTypes.LEFT) {
                    if (tool === EDITOR_MAP_TOOLS.PLACE_TILE) {
                        if (activeTile && activeTile !== "") {
                            setTile(cellX, cellY, activeTile);
                        }
                    } else if (tool === EDITOR_MAP_TOOLS.REMOVE_TIILE || tool === EDITOR_MAP_TOOLS.REMOVE_ALL) {
                        setTile(cellX, cellY, null);
                    }
                } else if (button === ButtonTypes.RIGHT) {
                    setTile(cellX, cellY, null);
                }
            }}
            onHover={(entities) => {
                setHoveredEntities(entities);
            }}
            showInvalidEntities={true}
        />
    );
}