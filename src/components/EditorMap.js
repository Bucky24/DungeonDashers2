import React, { useContext } from 'react';
import { ButtonTypes } from '@bucky24/react-canvas';

import TheMap from './TheMap';
import MapContext from '../contexts/MapContext';
import EditorContext from '../contexts/EditorContext';

export default function EditorMap() {
    const { map, setTile } = useContext(MapContext);
    const { setHoveredTiles, activeTile } = useContext(EditorContext);

    return (
        <TheMap
            map={map}
            onClick={(cellX, cellY, button) => {
                //console.log(cellX, cellY, button);
                if (button === ButtonTypes.LEFT) {
                    if (activeTile && activeTile !== "") {
                        setTile(cellX, cellY, activeTile);
                    }
                } else if (button === ButtonTypes.RIGHT) {
                    setTile(cellX, cellY, null);
                }
            }}
            onHover={(tiles) => {
                setHoveredTiles(tiles);
            }}
            showInvalidTiles={true}
        />
    );
}