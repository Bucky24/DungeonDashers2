import { useContext } from "react";
import GameContext, { EVENTS, FLAGS, POINT_COST } from "../../contexts/GameContext";
import MapContext, { TILE_TYPE } from "../../contexts/MapContext";
import ModuleContext from "../../contexts/ModuleContext";
import useTriggerEvent from "../events/useTriggerEvent";
import getEntityFlags from "../../utils/getEntityFlags";
import useGetEntityData from "../useGetEntityData";

export default function useMoveActiveCharacter() {
    const {
        activeCharacterIndex, 
        moveCharacter,
        characters,
        getEntitiesAtPosition,
        hasActiveEnemies,
        setCharacterProperty,
    } = useContext(GameContext);
    const { getTile } = useContext(MapContext);
    const { tiles, characters: characterData } = useContext(ModuleContext);
    const triggerEvent = useTriggerEvent();
    const getEntityData = useGetEntityData();

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
        const pointCost = collidableEntities.length > 0 ? POINT_COST.COMBAT : POINT_COST.MOVEMENT;
        if (hasActiveEnemies) {
            let totalPoints = character.actionPoints;
            if (totalPoints === undefined) {
                totalPoints = charData.actionPoints;
            }
            if (totalPoints < pointCost) {
                return;
            }
            setCharacterProperty(character.id, "actionPoints", totalPoints - pointCost);
        }
        if (collidableEntities.length > 0) {
            for (const entity of collidableEntities) {
                await triggerEvent(EVENTS.COLLIDE, [
                    { type: 'character', entity: character },
                    entity,
                ]);
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

        moveCharacter(activeCharacterIndex, character.x + xOff, character.y + yOff);
    }
}