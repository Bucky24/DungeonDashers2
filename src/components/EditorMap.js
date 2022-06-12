import React, { useContext } from 'react';
import { ButtonTypes } from '@bucky24/react-canvas';

import TheMap from './TheMap';
import MapContext from '../contexts/MapContext';

export default function EditorMap() {
    const { map, setTile } = useContext(MapContext);

    return (
        <TheMap
            map={map}
            onClick={(cellX, cellY, button) => {
                //console.log(cellX, cellY, button);
                if (button === ButtonTypes.LEFT) {
                    setTile(cellX, cellY, "main_ground1");
                } else if (button === ButtonTypes.RIGHT) {
                    setTile(cellX, cellY, null);
                }
            }}
        />
    );
}