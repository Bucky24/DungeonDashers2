import { getCharacters, getEnemies, getObjects } from "../../data/moduleData";

function useGetObjectEventHandlers() {
    return (objectType, event) => {
        const objects = getObjects();
        const objectData = objects[objectType];
        const result = [];

        if (!objectData) {
            console.error(`Got invalid object type ${objectType}`);
            return result;
        }

        if (!objectData.events) return result;

        return objectData.events.filter((eventData) => {
            return eventData.on === event;
        });
    }
}

function useGetCharacterEventHandlers() {
    return (type, event) => {
        const characters = getCharacters();
        const entityData = characters[type];
        const result = [];

        if (!entityData) {
            console.error(`Got invalid character type ${type}`);
            return result;
        }

        if (!entityData.events) return result;

        return entityData.events.filter((eventData) => {
            return eventData.on === event;
        })
    }
}

function useGetEnemyEventHandlers() {
    return (type, event) => {
        const enemies = getEnemies();
        const entityData = enemies[type];
        const result = [];

        if (!entityData) {
            console.error(`Got invalid enemy type ${type}`);
            return result;
        }

        if (!entityData.events) return result;

        return entityData.events.filter((eventData) => {
            return eventData.on === event;
        })
    }
}

export default function useGetEventHandlers() {
    const getObjectEventHandlers = useGetObjectEventHandlers();
    const getCharacterEventHandlers = useGetCharacterEventHandlers();
    const getEnemyEventHandlers = useGetEnemyEventHandlers();

    return (entity, event) => {
        if (entity.type === "object") {
            return getObjectEventHandlers(entity.entity.type, event);
        } else if (entity.type === "character") {
            return getCharacterEventHandlers(entity.entity.type, event);
        } else if (entity.type === "enemy") {
            return getEnemyEventHandlers(entity.entity.type, event);
        } else {
            console.error(`Unknown entity type ${entity.type}`);
            return [];
        }
    }
}