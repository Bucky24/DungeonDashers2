import { useContext } from "react"
import ModuleContext from "../../contexts/ModuleContext"

function useGetObjectEventHandlers() {
    const { objects } = useContext(ModuleContext);

    return (objectType, event) => {
        const objectData = objects[objectType];
        const result = [];

        if (!objectData) {
            console.error(`Got invalid object type ${objectType}`);
            return result;
        }

        if (!objectData.events) return result;

        return objectData.events.filter((eventData) => {
            return eventData.on === event;
        })
    }
}

function useGetCharacterEventHandlers() {
    const { characters } = useContext(ModuleContext);

    return (type, event) => {
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
    const { enemies } = useContext(ModuleContext);

    return (type, event) => {
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