import { useContext } from "react";
import GameContext, { EVENTS, FLAGS, COMBAT_ACTION } from "../../contexts/GameContext";
import MapContext, { TILE_TYPE } from "../../contexts/MapContext";
import ModuleContext from "../../contexts/ModuleContext";
import useTriggerEvent from "../events/useTriggerEvent";
import getEntityFlags from "../../utils/getEntityFlags";
import getEntityData from "../../data/helpers/getEntityData";

export default function useMoveActiveCharacter() {
    const {
        activeCharacterIndex, 
        moveCharacter,
        characters,
        getEntitiesAtPosition,
        hasActiveEnemies,
        setCharacterProperty,
        setEnemyProperty,
    } = useContext(GameContext);
    const { getTile } = useContext(MapContext);
    const { tiles, characters: characterData, enemies: enemyData } = useContext(ModuleContext);
    const triggerEvent = useTriggerEvent();

    return async (xOff, yOff) => {
        if (xOff === 0 && yOff === 0) {
            return;
        }

        const character = characters[activeCharacterIndex];
        if (!character) {
            console.warn("No active character");
            return;
        }
        const charData = characterData[character.type];

        const newX = character.x + xOff;
        const newY = character.y + yOff;

        let newState = "base_down";

        if (xOff === 0) {
            if (yOff > 0) {
                newState = "base_down";
            } else {
                newState = "base_up";
            }
        } else {
            if (xOff > 0) {
                newState = "base_right";
            } else {
                newState = "base_left";
            }
        }

        const tile = getTile(newX, newY);
        const tileData = tiles[tile?.tile];

        if (tileData?.type !== TILE_TYPE.GROUND) {
            return;
        }

        const entities = getEntitiesAtPosition(newX, newY);
        const collidableEntities = entities.filter((entity) => {
            const data = getEntityData(entity);
            const flags = getEntityFlags(entity, data);
            const isNonBlocking = flags.includes(FLAGS.NONBLOCKING) || flags.includes(FLAGS.INACTIVE);
            // if it's non blocking we can't collide with it
            return !isNonBlocking;
        });

        // if in combat, does character have the necessary action points?
        const pointCost = collidableEntities.length > 0 ? COMBAT_ACTION.ATTACK : COMBAT_ACTION.MOVE;
        let totalPoints;
        if (hasActiveEnemies) {
            totalPoints = character.actionPoints;
            if (totalPoints === undefined) {
                totalPoints = charData.actionPoints;
            }
            if (totalPoints < pointCost) {
                return;
            }
        }
        if (collidableEntities.length > 0) {
            if (hasActiveEnemies) {
                // find the first enemy in the stack and damage them
                const enemy = collidableEntities.find((entity) => entity.type === "enemy");
                if (!enemy) {
                    return;
                }

                const eData = enemyData[enemy.entity.type];
                let enemyHp = enemy.entity.hp || eData.maxHP;
                setEnemyProperty(enemy.entity.id, "hp", Math.max(0, enemyHp - 5));
                setCharacterProperty(character.type, "actionPoints", totalPoints - pointCost);
            } else {
                for (const entity of collidableEntities) {
                    await triggerEvent(EVENTS.COLLIDE, [
                        { type: 'character', entity: character },
                        entity,
                    ]);
                }
            }

            return;
        }

        // intersect is when the character steps on top of the item
        // we can assume by getting here that we actually moved because
        // if we were stopped by a collision then we would have returned
        // above
        if (entities.length > 0) {
            for (const entity of entities) {
                await triggerEvent(EVENTS.INTERSECT, [
                    { type: 'character', entity: character },
                    entity,
                ]);
            }
        }

        setCharacterProperty(character.type, "actionPoints", totalPoints - pointCost);
        setCharacterProperty(character.type, "state", newState);
        moveCharacter(activeCharacterIndex, character.x + xOff, character.y + yOff);
    }
}