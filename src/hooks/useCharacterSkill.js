import useTriggerEvent from "./events/useTriggerEvent";
import useGetEntityContext from "./useGetEntityContext";
import useRunScript from "./useRunScript";
import getEntityData from "../data/helpers/getEntityData";

export default function useCharacterSkill() {
    const runScript = useRunScript();
    const getEntityContext = useGetEntityContext();
    const triggerEvent = useTriggerEvent();

    return async (character, skill) => {
        const entity = {
            type: 'character',
            entity: character,
        };
        const characterData = getEntityData(entity);

        const specialSkill = characterData?.skills?.[skill];
        if (!specialSkill) {
            return;
        }

        if (specialSkill.type === "script") {
            if (!characterData?.scripts?.[specialSkill.file]) {
                console.error(`Cannot find script matching ${specialSkill.file}`);
                return;
            }
            await runScript(characterData.scripts[specialSkill.file].script, {
                entity: getEntityContext(entity, triggerEvent),
            });
        } else {
            console.error(`Unknown Skill type of ${specialSkill.type} for skill ${skill}`);
        }
    }
}