import React, { useContext } from 'react';

import TheMap from './TheMap';
import MapContext from '../contexts/MapContext';

export default function GameMap() {
    const { map } = useContext(MapContext);

    return (
        <TheMap
            map={map}
        />
    );
}