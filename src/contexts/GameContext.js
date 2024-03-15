import React, { useContext, useState } from 'react';

import Coms from '../utils/coms';
import MapContext from './MapContext';

const GameContext = React.createContext({});
export default GameContext;

export const EVENTS = {
    COLLIDE: 'collide', 
};

export const FLAGS = {
    NONBLOCKING: 'nonblocking',
};

export function GameProvider({ children }) {
    const [loaded, setLoaded] = useState(false);
    const { loadMap } = useContext(MapContext);
    const [activeCharacterIndex, setActiveCharacterIndex] = useState(-1);
    const [objects, setObjects] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [objectId, setObjectId] = useState(0);

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

            let objectId = 1;
            const objects = mapData.objects.map((object) => {
                return {
                    ...object,
                    id: objectId++,
                };
            });

            setObjects(mapData.objects);
            setCharacters(mapData.characters);
            setActiveCharacterIndex(0);
            setLoaded(true);
            setObjectId(objectId);
        },
        moveCharacter: (index, x, y) => {
            const newChars = [...characters];
            newChars[index].x = x;
            newChars[index].y = y;

            setCharacters(newChars);
        },
        getEntitiesAtPosition: (x, y) => {
            const result = [];
            for (const entity of objects) {
                if (entity.x ===x && entity.y === y) {
                    result.push({
                        type: 'object',
                        entity,
                    });
                }
            }

            for (const entity of characters) {
                if (entity.x === x && entity.y === y) {
                    result.push({
                        type: 'character',
                        entity,
                    });
                }
            }

            return result;
        },
        setObjectProperty: (id, key, value) => {
            setObjects((objects) => {
                const objectIndex = objects.findIndex((object) => object.id === id);
                const object = objects[objectIndex];

                if (!object) {
                    console.error(`Can't find object with id ${id}`);
                    return;
                }

                const newObjects = [...objects];
                newObjects[objectIndex] = {
                    ...object,
                    [key]: value,
                };

                return newObjects;
            });
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