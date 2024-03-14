import React, { useContext, useState } from 'react';

import Coms from '../utils/coms';
import MapContext from './MapContext';

const GameContext = React.createContext({});
export default GameContext;

export function GameProvider({ children }) {
    const [loaded, setLoaded] = useState(false);
    const { loadMap } = useContext(MapContext);
    const [activeCharacterIndex, setActiveCharacterIndex] = useState(-1);
    const [objects, setObjects] = useState([]);
    const [characters, setCharacters] = useState([]);

    const value = {
        loadGame: (name) => {
            setLoaded(false);
            Coms.send('getSavedGame', { name }).then(async (result) => {
                if (!result.success) {
                    console.error(result.message);
                    return;
                }

                const map = result.game.map;

                const mapData = await loadMap(map);

                setObjects(mapData.objects);
                setCharacters(mapData.characters);
                setActiveCharacterIndex(0);
                setLoaded(true);
            });
        },
        newGame: async (map) => {
            loadMap(map);
            const mapData = await loadMap(map);

            setObjects(mapData.objects);
            setCharacters(mapData.characters);
            setActiveCharacterIndex(0);
            setLoaded(true);
        },
        moveCharacter: (index, x, y) => {
            const newChars = [...characters];
            newChars[index].x = x;
            newChars[index].y = y;

            setCharacters(newChars);
        },
        loaded,
        objects,
        characters,
        activeCharacterIndex,
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}