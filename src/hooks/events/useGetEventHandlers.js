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

export default function useGetEventHandlers() {
    const getObjectEventHandlers = useGetObjectEventHandlers();

    return (entity, event) => {
        if (entity.type === "object") {
            return getObjectEventHandlers(entity.entity.type, event);
        } else {
            console.error(`Unknown entity type ${entity.type}`);
            return [];
        }
    }
}