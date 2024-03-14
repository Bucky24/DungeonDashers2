import React from 'react';

import GameMap from '../components/GameMap';
import useLoaded from '../hooks/useLoaded';

export default function Game() {
    const loaded = useLoaded();

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