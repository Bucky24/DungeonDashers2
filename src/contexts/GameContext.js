import React from 'react';

import Coms from '../utils/coms';

const GameContext = React.createContext({});
export default GameContext;

export function GameProvider({ children }) {
    const value = {
        loadGame: (name) => {
            Coms.send('getSavedGame', { name }).then((result) => {
                if (!result.success) {
                    console.error(result.message);
                    return;
                }

                console.log(result.game);
            })
        },
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}