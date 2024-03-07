import React, { useContext, useEffect } from 'react';

import GameContext from '../contexts/GameContext';
import ModuleContext from '../contexts/ModuleContext';
import ImageContext from '../contexts/ImageContext';
import GameMap from '../components/GameMap';
import MapContext from '../contexts/MapContext';

export default function Game() {
	const { loaded: gameLoaded } = useContext(GameContext);
	const { loaded: moduleLoaded } = useContext(ModuleContext);
	const { loaded: imagesLoaded } = useContext(ImageContext);
    const { loaded: mapLoaded } = useContext(MapContext);

	const loaded = gameLoaded && moduleLoaded && imagesLoaded && mapLoaded;

    return (
        <>
            {!loaded && (
                <div>
                    Loading
                </div>
            )}
            {loaded && (
                <GameMap />
            )}
        </>
    )
}