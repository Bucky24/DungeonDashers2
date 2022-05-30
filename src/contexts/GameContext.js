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

                const map = result.game.map;

                Coms.send("getMap", { name: map }).then((result) => {
                    if (!result.success) {
                        console.error(result.message);
                        return;
                    }

                    const modules = result.map.modules;
                    loadModules(modules);
                    setMap(result.map.map || []);

                    setLoaded(true);
                });
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