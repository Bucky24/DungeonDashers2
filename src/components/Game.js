import React, { useContext, useEffect } from 'react';

import GameContext from '../contexts/GameContext';
import ModuleContext from '../contexts/ModuleContext';
import ImageContext from '../contexts/ImageContext';
import GameMap from './GameMap';

export default function Game() {
	const { loadGame, loaded: gameLoaded } = useContext(GameContext);
	const { loaded: moduleLoaded } = useContext(ModuleContext);
	const { loaded: imagesLoaded } = useContext(ImageContext);

    useEffect(() => {
		loadGame('main');
	}, []);

	const loaded = gameLoaded && moduleLoaded && imagesLoaded;

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