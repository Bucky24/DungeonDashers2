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
            entityType: 'object',
            state: objectData.state || moduleData.defaultState,
            flags: myFlags,
            data: objectData.data,
            type: objectData.type,
            x: objectData.x,
            y: objectData.y,
            id: objectData.id,
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
            _getEntity: function() {
                return {
                    type: 'object',
                    entity: {
                        ...objectData,
                        state: this.state,
                        flags: this.flags,
                        data: this.data,
                        type: this.type,
                        x: this.x,
                        y: this.y,
                        id: this.id,
                    },
                };
            },
            getId: function() {
                return this.id;
            },
            removeFlag: function(flag) {
                if (!this.flags.includes(flag)) {
                    return;
                }

                const index = this.flags.indexOf(flag);

                this.flags.splice(index, 1);

                setObjectProperty(this.id, "flags", [...this.flags]);
            },
        };
    }
}

function useGetCharacterContext() {
    const { setCharacterProperty, getEntitiesAtPosition } = useContext(GameContext);
    const { characters } = useContext(ModuleContext);

    // this should be the object from GameContext
    return (characterData, triggerEvent) => {
        const data = characters[characterData.type];
        const myHp = characterData.hp || data.maxHP;
        const flags = characterData.flags || [];
        return {
            entityType: 'character',
            data: characterData.data,
            x: characterData.x,
            y: characterData.y,
            hp: myHp,
            flags,
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
                            this._getEntity(),
                            entity,
                        ]);
                    }
                }

                this.x = x;
                this.y = y;
                setCharacterProperty(characterData.id, "x", x);
                setCharacterProperty(characterData.id, "y", y);
            },
            damage: function(amount) {
                const newHp = Math.max(0, this.hp - amount);
                setCharacterProperty(characterData.id, "hp", newHp);
            },
            setFlag: function(flag) {
                if (this.flags.includes(flag)) {
                    return;
                }

                this.flags.push(flag);
                setCharacterProperty(characterData.id, "flags", [...this.flags]);
            },
            removeFlag: function(flag) {
                if (!this.flags.includes(flag)) {
                    return;
                }

                const index = this.flags.indexOf(flag);

                this.flags.splice(index, 1);

                setCharacterProperty(this.id, "flags", [...this.flags]);
            },
            _getEntity: function() {
                return {
                    type: 'character',
                    entity: {
                        ...characterData,
                        flags: this.flags,
                        data: this.data,
                        x: this.x,
                        y: this.y,
                    },
                };
            },
        };
    }
}

function useGetEnemyContext() {
    const { enemies } = useContext(ModuleContext);
    const { setEnemyProperty, getEntitiesAtPosition } = useContext(GameContext);

    return (enemyData, triggerEvent) => {
        const moduleData = enemies[enemyData.type] || {};
        const myFlags = getEntityFlags({ type: 'enemy', entity: enemyData }, moduleData);
        let actionPoints = enemyData.actionPoints || moduleData.actionPoints;

        return {
            entityType: 'enemy',
            type: enemyData.type,
            data: enemyData.data,
            flags: myFlags,
            id: enemyData.id,
            actionPoints,
            x: enemyData.x,
            y: enemyData.y,
            getData: function() {
                return this.data;
            },
            removeFlag: function(flag) {
                if (!this.flags.includes(flag)) {
                    return;
                }

                const index = this.flags.indexOf(flag);

                this.flags.splice(index, 1);

                setEnemyProperty(this.id, "flags", [...this.flags]);
            },
            canTakeAction: function(action) {
                // action will be one of COMBAT_ACTION which has a point cost associated as the value
                return action && this.actionPoints >= action;
            },
            getPos: function() {
                return {
                    x: this.x,
                    y: this.y,
                };
            },
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
            takeAction: function(action) {
                this.actionPoints -= action;
                this.actionPoints = Math.max(this.actionPoints, 0);
                setEnemyProperty(this.id, "actionPoints", this.actionPoints);
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
