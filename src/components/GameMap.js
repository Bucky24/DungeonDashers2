import React, { useContext } from 'react';

import TheMap from './TheMap';
import MapContext from '../contexts/MapContext';
import { useHandleKeyboard } from '../utils/handleInput';
import GameContext from '../contexts/GameContext';

export default function GameMap() {
    const { map } = useContext(MapContext);
    const { objects, characters, activeCharacterIndex } = useContext(GameContext);
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
            moveLocked={true}
            xOff={100}
            yOff={100}
            centerX={characters[activeCharacterIndex].x}
            centerY={characters[activeCharacterIndex].y}
        />
    );
}