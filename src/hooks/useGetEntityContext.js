import { useContext } from 'react';

import ModuleContext from '../contexts/ModuleContext';
import GameContext, { EVENTS } from '../contexts/GameContext';
import getEntityFlags from '../utils/getEntityFlags';

function useGetGenericEntityContext() {
    return (entityData, moduleData, entityType, updateEntity) => {
        const myFlags = getEntityFlags({ type: entityType, entity: entityData }, moduleData);
        const myHp = entityData.hp || moduleData.maxHP;
        const actionPoints = entityData.actionPoints || moduleData.actionPoints;

        return {
            entityType,
            state: entityData.state || moduleData.defaultState,
            flags: myFlags,
            data: entityData.data,
            type: entityData.type,
            x: entityData.x,
            y: entityData.y,
            id: entityData.id,
            hp: myHp,
            actionPoints,
            getState: function() {
                return this.state;
            },
            setState: function(newState) {
                updateEntity(this.id, "state", newState);
                this.state = newState;
            },
            setFlag: function(flag) {
                if (this.antiFlags && this.antiFlags.includes(flag)) {
                    const index = this.antiFlags.indexOf(flag);

                    this.antiFlags.splice(index, 1);
                    updateEntity(this.id, "antiFlags", [...this.flags]);
                }
                if (this.flags.includes(flag)) {
                    return;
                }

                this.flags.push(flag);

                updateEntity(this.id, "flags", [...this.flags]);
            },
            getData: function() {
                return this.data || null;
            },
            getFlags: function() {
                return this.flags || [];
            },
            getId: function() {
                return this.id;
            },
            removeFlag: function(flag) {
                const index = this.flags.indexOf(flag);

                this.flags.splice(index, 1);

                updateEntity(this.id, "flags", [...this.flags]);
                updateEntity(this.id, "antiFlags", [
                    ...this.antiFlags || [],
                    flag,
                ]);
            },
            getPos: function() {
                return {
                    x: this.x,
                    y: this.y,
                };
            },
            canTakeAction: function(action, times = 1) {
                // action will be one of COMBAT_ACTION which has a point cost associated as the value
                return action && this.actionPoints >= action*times;
            },
            takeAction: function(action) {
                this.actionPoints -= action;
                this.actionPoints = Math.max(this.actionPoints, 0);
                updateEntity(this.id, "actionPoints", this.actionPoints);
            },

            _getEntity: function() {
                return {
                    type: entityType,
                    entity: {
                        ...entityData,
                        state: this.state,
                        flags: this.flags,
                        data: this.data,
                        type: this.type,
                        x: this.x,
                        y: this.y,
                        id: this.id,
                        hp: this.hp,
                        actionPoints,
                    },
                };
            },
        };
    }
}

function useGetObjectContext() {
    const { objects } = useContext(ModuleContext);
    const { setObjectProperty, destroyObject } = useContext(GameContext);
    const getGenericEntityContext = useGetGenericEntityContext();

    // this should be the object from GameContext
    return (objectData, triggerEvent) => {
        const moduleData = objects[objectData.type] || {};

        const generic = getGenericEntityContext(objectData, moduleData, "object", setObjectProperty);

        return {
            ...generic,
            moveTo: function(x, y) {
                this.x = x;
                this.y = y;
                setObjectProperty(objectData.id, "x", x);
                setObjectProperty(objectData.id, "y", y);
            },
            damage: async (amount) => {
                const results = await triggerEvent(EVENTS.ATTACKED, [generic._getEntity()]);
                // if any false result, cancel damage
                if (results.some((result) => result === false)) {
                    return;
                }

                // right now any amount of damage will destroy the object
                destroyObject(objectData.id);
            },
        };
    }
}

function useGetCharacterContext() {
    const { setCharacterProperty, getEntitiesAtPosition } = useContext(GameContext);
    const { characters } = useContext(ModuleContext);
    const getGenericEntityContext = useGetGenericEntityContext();

    // this should be the object from GameContext
    return (characterData, triggerEvent) => {
        const data = characters[characterData.type];
        const generic = getGenericEntityContext(characterData, data, "character", setCharacterProperty);
        
        return {
            ...generic,
            moveTo: async function(x, y, collide = false) {
                // run intersection code
                const entities = getEntitiesAtPosition(x, y);
                if (entities.length > 0) {
                    for (const entity of entities) {
                        await triggerEvent(EVENTS.INTERSECT, [
                            this._getEntity(),
                            entity,
                        ]);
                        if (collide) {
                            await triggerEvent(EVENTS.COLLIDE, [
                                this._getEntity(),
                                entity,
                            ]);
                        }
                    }
                }

                this.x = x;
                this.y = y;
                setCharacterProperty(characterData.type, "x", x);
                setCharacterProperty(characterData.type, "y", y);
            },
            damage: function(amount) {
                const newHp = Math.max(0, this.hp - amount);
                setCharacterProperty(characterData.type, "hp", newHp);
            },
        };
    }
}

function useGetEnemyContext() {
    const { enemies } = useContext(ModuleContext);
    const { setEnemyProperty, getEntitiesAtPosition } = useContext(GameContext);
    const getGenericEntityContext = useGetGenericEntityContext();

    return (enemyData, triggerEvent) => {
        const moduleData = enemies[enemyData.type] || {};

        const generic = getGenericEntityContext(enemyData, moduleData, "enemy", setEnemyProperty);

        return {
            ...generic,
            moveTowards: async function(x, y, steps, collide = false) {
                let xOff = x - this.x;
                let yOff = y - this.y;
    
                if (xOff === 0 && yOff === 0) {
                    return;
                }

                // break it down to units
                if (xOff != 0) xOff /= Math.abs(xOff);
                if (yOff != 0) yOff /= Math.abs(yOff);

                let curX = this.x;
                let curY = this.y;
                for (let i=0;i<steps;i++) {
                    curX += xOff;
                    curY += yOff;

                    if (collide) {
                        const entities = getEntitiesAtPosition(curX, curY);
                        if (entities.length > 0) {
                            return false;
                        }
                    }

                    await this.moveTo(curX, curY);
                }

                return true;
            },
            moveTo: async function(x, y) {
                // run intersection code
                const entities = getEntitiesAtPosition(x, y);
                if (entities.length > 0) {
                    for (const entity of entities) {
                        await triggerEvent(EVENTS.INTERSECT, [
                            { type: 'enemy', entity: this },
                            entity,
                        ]);
                    }
                }

                this.x = x;
                this.y = y;
                setEnemyProperty(this.id, "x", x);
                setEnemyProperty(this.id, "y", y);
            },
        };
    }
}

export default function useGetEntityContext() {
    const getObjectContext = useGetObjectContext();
    const getCharacterContext = useGetCharacterContext();
    const getEnemyContext = useGetEnemyContext();

    return (entity, triggerEvent) => {
        if (entity.type === "object") {
            return getObjectContext(entity.entity, triggerEvent);
        } else if (entity.type === "character") {
            return getCharacterContext(entity.entity, triggerEvent);
        } else if (entity.type === "enemy") {
            return getEnemyContext(entity.entity, triggerEvent);
        } else {
            console.error(`getEntityContext doesn't recognize type ${entity.type}`);
        }
    }
}
