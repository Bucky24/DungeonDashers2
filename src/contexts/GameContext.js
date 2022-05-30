import React, { useContext, useState } from 'react';

import Coms from '../utils/coms';
import ModuleContext from './ModuleContext';

const GameContext = React.createContext({});
export default GameContext;

export function GameProvider({ children }) {
    const [loaded, setLoaded] = useState(false);
    const { loadModules } = useContext(ModuleContext);
    const [map, setMap] = useState([]);

    const value = {
        loadGame: (name) => {
            setLoaded(false);
            Coms.send('getSavedGame', { name }).then((result) => {
                if (!result.success) {
                    console.error(result.message);
                    return;
                }

                const modules = result.game.modules;
                loadModules(modules);
                setMap(result.game.map || []);

                setLoaded(true);
            });
        },
        loaded,
        map,
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}