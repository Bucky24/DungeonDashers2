import React, { useContext, useEffect, useRef, useState } from 'react';

import Coms from '../utils/coms';
import MapContext from './MapContext';
import ModuleContext from './ModuleContext';

const GameContext = React.createContext({});
export default GameContext;

export const EVENTS = {
    COLLIDE: 'collide',
    INTERSECT: 'intersect',
};

export const FLAGS = {
    NONBLOCKING: 'nonblocking',
    INACTIVE: 'inactive',
};

export const TREASURE = {
    GOLD: 'gold',
};

export const MOVEMENT = {
    WALKING: 'movement/walking',
};

export const COMBAT_ACTION = {
    MOVE: 1,
    ATTACK: 10,
};

export const COMBAT_TURN = {
    PLAYER: 'combat/player',
    ENEMY: 'combat/enemy',
};

export function GameProvider({ children }) {
    const [loaded, setLoaded] = useState(false);
    const { loadMap, mapName } = useContext(MapContext);
    const [activeCharacterIndex, setActiveCharacterIndex] = useState(-1);
    const [objects, setObjects] = useState([]);
    const [characters, setCharacters] = useState([]);
    const objectIdRef = useRef(0);
    const [gold, setGold] = useState(0);
    const [paused, setPaused] = useState(false);
    const [cameraCenterPos, setCameraCenterPos] = useState(null);
    const { characters: characterData, enemies: enemyData } = useContext(ModuleContext);
    const [enemies, setEnemies] = useState([]);
    const [hasActiveEnemies, setHasActiveEnemies] = useState(false);
    const [combatTurn, setCombatTurn] = useState(COMBAT_TURN.PLAYER);
    const [activeEnemyIndex, setActiveEnemyIndex] = useState(-1);

    useEffect(() => {
        let foundActive = false;
        const newEnemies = enemies.filter((enemy) => {
            return enemy.hp === undefined || enemy.hp > 0;
        });

        newEnemies?.map((enemy) => {
            if (enemy.flags?.includes(FLAGS.INACTIVE)) {
                return;
            }

            foundActive = true;
        });

        if (newEnemies.length !== enemies.length) {
            setEnemies(newEnemies);
        }
        setHasActiveEnemies(foundActive);
    }, [enemies]);

    useEffect(() => {
        if (!hasActiveEnemies && combatTurn === COMBAT_TURN.PLAYER) {
            return;
        }

        const activeCharacter = characters[activeCharacterIndex];
        // if on the last character and they are out of action points
        if (activeCharacter.actionPoints === 0 && activeCharacterIndex === characters.length-1) {
            setCombatTurn(COMBAT_TURN.ENEMY);
            setActiveEnemyIndex(0);
        }
    }, [characters, hasActiveEnemies]);

    useEffect(() => {
        setCharacters((characters) => {
            const newCharacters = [...characters];
            // reset action points for all characters
            for (const character of newCharacters) {
                const data = characterData[character.type];
                character.actionPoints = data.actionPoints;
            }
            
            return newCharacters;
        });
        // reset action points for all enemies
        setEnemies((enemies) => {
            const newEnemies = [...enemies];
            for (const enemy of newEnemies) {
                const data = enemyData[enemy.type];
                enemy.actionPoints = data.actionPoints;
            }
            
            return newEnemies;
        });
    }, [combatTurn]);

    const value = {
        loaded,
        objects,
        characters,
        activeCharacterIndex,
        gold,
        paused,
        cameraCenterPos,
        enemies,
        hasActiveEnemies,
        combatTurn,
        activeEnemyIndex,
        loadGame: (name) => {
            setLoaded(false);
            Coms.send('getSavedGame', { name }).then(async (result) => {
                if (!result.success) {
                    console.error(result.message);
                    return;
                }

                const map = result.game.map;

                await loadMap(map);

                setObjects(result.game.objects);
                setCharacters(result.game.characters);
                setEnemies(result.game.enemies);
                setActiveCharacterIndex(result.game.gameData.activeCharacterIndex);
                setActiveEnemyIndex(result.game.gameData.activeEnemyIndex);
                setGold(result.game.gameData.gold);
                setCombatTurn(result.game.gameData.combatTurn);
                objectIdRef.current = result.game.gameData.objectId;
                setLoaded(true);
            });
        },
        newGame: async (map) => {
            loadMap(map);
            const mapData = await loadMap(map);

            // make this smarter to avoid id collision
            let objectId = 10000;
            const objects = mapData.objects.map((object) => {
                if (!object.id) {
                    return {
                        ...object,
                        id: objectId++,
                    };
                }

                return object;
            });
            const enemies = mapData.enemies.map((enemy) => {
                if (!enemy.id) {
                    return {
                        ...enemy,
                        id: objectId++,
                    };
                }

                return enemy;
            });

            setObjects(objects);
            setCharacters(mapData.characters);
            setEnemies(enemies);
            setActiveCharacterIndex(0);
            setLoaded(true);
            objectIdRef.current = objectId;
            setGold(0);
        },
        moveCharacter: (index, x, y) => {
            setCharacters((characters) => {
                const newChars = [...characters];
                newChars[index].x = x;
                newChars[index].y = y;

                return newChars
            });
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

            for (const entity of enemies) {
                if (entity.x === x && entity.y === y) {
                    result.push({
                        type: 'enemy',
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
        setCharacterProperty: (id, key, value) => {
            setCharacters((entities) => {
                const entityIndex = entities.findIndex((entity) => entity.id === id);
                const entity = entities[entityIndex];

                if (!entity) {
                    console.error(`Can't find character with id ${id}`);
                    return;
                }

                const newEntities = [...entities];
                newEntities[entityIndex] = {
                    ...entity,
                    [key]: value,
                };

                return newEntities;
            });
        },
        setEnemyProperty: (id, key, value) => {
            setEnemies((entities) => {
                const entityIndex = entities.findIndex((entity) => entity.id === id);
                const entity = entities[entityIndex];

                if (!entity) {
                    console.error(`Can't find enemy with id ${id}`);
                    return;
                }

                const newEntities = [...entities];
                newEntities[entityIndex] = {
                    ...entity,
                    [key]: value,
                };

                return newEntities;
            });
        },
        addGold: (amount) => {
            setGold(Math.max(0, gold + amount));
        },
        setPaused,
        centerCamera: (x, y) => {
            setCameraCenterPos({ x, y });
        },
        addCharacter: (type, x, y) => {
            if (!characterData[type]) {
                console.error(`Unknown character type ${type}`);
            }
            const newId = objectIdRef.current ++;
            const newEntity = {
                id: newId,
                type,
                x,
                y,
            };

            setCharacters((entities) => {
                const newEntities = [...entities];
                newEntities.push(newEntity);

                return newEntities;
            });
        },
        setActiveCharacterIndex,
        resetCamera: () => {
            setCameraCenterPos(null);
        },
        destroyObject: (id) => {
            setObjects((objects) => {
                const objectIndex = objects.findIndex((object) => object.id === id);

                if (objectIndex < 0) {
                    console.error(`Can't find object with id ${id}`);
                    return;
                }
                
                const newObjects = [...objects];
                newObjects.splice(objectIndex, 1);

                return newObjects;
            });
        },
        getEntities: () => {
            return [
                ...objects.map(entity => { return { type: 'object', entity } }),
                ...characters.map(entity => { return { type: 'character', entity } }),
                ...enemies.map(entity => { return { type: 'enemy', entity } }),
            ];
        },
        setCombatTurn,
        setActiveEnemyIndex,
        saveGame: async (name) => {
            const saveData = {
                map: mapName,
                characters,
                enemies,
                objects,
                gameData: {
                    activeCharacterIndex,
                    activeEnemyIndex,
                    gold,
                    combatTurn,
                    objectId: objectIdRef.current,
                },
            };

            await Coms.send("saveGame", {
                name,
                saveData,
            });
        }
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}