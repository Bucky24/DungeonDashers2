import React, { useContext, useState } from 'react';

import Coms from '../utils/coms';
import MapContext from './MapContext';

const GameContext = React.createContext({});
export default GameContext;

export function GameProvider({ children }) {
    const [loaded, setLoaded] = useState(false);
    const { loadMap } = useContext(MapContext);

    const value = {
        loadGame: (name) => {
            setLoaded(false);
            Coms.send('getSavedGame', { name }).then((result) => {
                if (!result.success) {
                    console.error(result.message);
                    return;
                }

                const map = result.game.map;

                loadMap(map);
                setLoaded(true);
            });
        },
        loaded,
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}