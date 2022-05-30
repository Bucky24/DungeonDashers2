import React, { useContext } from 'react';

import TheMap from './TheMap';
import GameContext from '../contexts/GameContext';

export default function GameMap() {
    const { map } = useContext(GameContext);

    return (
        <TheMap
            map={map}
        />
    );
}