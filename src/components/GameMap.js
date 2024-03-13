import React, { useContext } from 'react';

import TheMap from './TheMap';
import MapContext from '../contexts/MapContext';

export default function GameMap() {
    const { map, objects } = useContext(MapContext);

    return (
        <TheMap
            map={map}
            objects={objects}
            zoomLocked={true}
            zoom={200}
        />
    );
}