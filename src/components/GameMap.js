import React, { useContext } from 'react';

import TheMap from './TheMap';
import MapContext from '../contexts/MapContext';
import { useHandleKeyboard } from '../utils/handleInput';

export default function GameMap() {
    const { map, objects, characters } = useContext(MapContext);
    const handleKeyboard = useHandleKeyboard();

    return (
        <TheMap
            map={map}
            objects={objects}
            zoomLocked={true}
            zoom={200}
            characters={characters}
            onKey={(code) => {
                handleKeyboard(code);
            }}
        />
    );
}