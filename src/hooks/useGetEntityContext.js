import { useContext } from 'react';

import ModuleContext from '../contexts/ModuleContext';
import GameContext, { EVENTS } from '../contexts/GameContext';
import getEntityFlags from '../utils/getEntityFlags';

function useGetObjectContext() {
    const { objects } = useContext(ModuleContext);
    const { setObjectProperty, destroyObject } = useContext(GameContext);

    // this should be the object from GameContext
    return (objectData) => {
        const moduleData = objects[objectData.type] || {};
        const myFlags = getEntityFlags({ type: 'object', entity: objectData }, moduleData);

        return {
            state: objectData.state || moduleData.defaultState,
            flags: myFlags,
            data: objectData.data,
            type: objectData.type,
            x: objectData.x,
            y: objectData.y,
            getState: function() {
                return this.state;
            },
            setState: function(newState) {
                setObjectProperty(objectData.id, "state", newState);
                this.state = newState;
            },
            setFlag: function(flag) {
                if (this.flags.includes(flag)) {
                    return;
                }

                this.flags.push(flag);

                setObjectProperty(objectData.id, "flags", [...this.flags]);
            },
            getData: function() {
                return this.data || null;
            },
            getFlags: function() {
                return this.flags || [];
            },
            moveTo: function(x, y) {
                this.x = x;
                this.y = y;
                setObjectProperty(objectData.id, "x", x);
                setObjectProperty(objectData.id, "y", y);
            },
            damage: (amount) => {
                // right now any amount of damage will destroy the object
                destroyObject(objectData.id);
            },
        };
    }
}

function useGetCharacterContext() {
    const { setCharacterProperty, getEntitiesAtPosition } = useContext(GameContext);

    // this should be the object from GameContext
    return (characterData, triggerEvent) => {
        return {
            data: characterData.data,
            x: characterData.x,
            y: characterData.y,
            getData: function() {
                return this.data || null;
            },
            getPos: function() {
                return {
                    x: this.x,
                    y: this.y,
                };
            },
            moveTo: async function(x, y) {
                // run intersection code
                const entities = getEntitiesAtPosition(x, y);
                if (entities.length > 0) {
                    for (const entity of entities) {
                        await triggerEvent(EVENTS.INTERSECT, [
                            { type: 'character', entity: this },
                            entity,
                        ]);
                    }
                }

                this.x = x;
                this.y = y;
                setCharacterProperty(characterData.id, "x", x);
                setCharacterProperty(characterData.id, "y", y);
            },
        };
    }
}

export default function useGetEntityContext() {
    const getObjectContext = useGetObjectContext();
    const getCharacterContext = useGetCharacterContext();

    return (entity, triggerEvent) => {
        if (entity.type === "object") {
            return getObjectContext(entity.entity, triggerEvent);
        } else if (entity.type === "character") {
            return getCharacterContext(entity.entity, triggerEvent);
        }
    }
}
