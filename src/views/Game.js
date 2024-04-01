import React from 'react';

import GameMap from '../components/GameMap';
import useLoaded from '../hooks/useLoaded';
import GameHud from '../components/GameHud';

export default function Game() {
    const { allLoaded: loaded } = useLoaded();

    return (
        <>
            {!loaded && (
                <div>
                    Loading
                </div>
            )}
            {loaded && (
                <>
                    <GameMap />
                    <GameHud />
                </>
            )}
        </>
    )
}