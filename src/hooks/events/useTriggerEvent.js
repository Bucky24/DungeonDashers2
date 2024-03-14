import filterEntities from "../../utils/filterEntities";
import useGetEventHandlers from "./useGetEventHandlers";
import useRunScript from "../useRunScript";
import useGetEntityContext from '../useGetEntityContext';
import useGetEntityData from "../useGetEntityData";

export default function useTriggerEvent() {
    const getEventHandlers = useGetEventHandlers();
    const runScript = useRunScript();
    const getEntityContext = useGetEntityContext();
    const getEntityData = useGetEntityData();

    return async (event, entities = []) => {
        for (const entity of entities) {
            if (entity.type === 'object') {
                const handlerData = getEventHandlers(entity, event);

                for (const handler of handlerData) {
                    const filteredEntities = filterEntities(entities, handler.filters);
                    for (const entity2 of filteredEntities) {
                        // if they're standing in the same spot they already collided
                        // so we don't need to process it
                        if (entity.entity.x === entity2.entity.x && entity.entity.y === entity2.entity.y) {
                            continue;
                        }

                        if (handler.type === "script") {
                            const entityData = getEntityData(entity);
                            if (!entityData?.scripts?.[handler.file]) {
                                console.error(`Cannot find script matching ${handler.file}`);
                                break;
                            }
                            await runScript(entityData.scripts[handler.file].script, {
                                entity: getEntityContext(entity),
                                other: getEntityContext(entity2),
                            });
                        }
                    }
                }   
            }
        }
    }
}