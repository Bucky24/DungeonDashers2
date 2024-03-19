import { useContext } from "react";

import MapContext from "../contexts/MapContext";
import runCode from "../utils/runCode";

////////////////////
// If you want to pass the game script contenxt, you MUST generate it outside of
// this method. This method is USED by the game script context so it cannot
// make use of the hook or else it will explode.
////////////////////

export default function useRunMapTrigger() {
    const { triggers } = useContext(MapContext);

    return async (triggerName, data) => {
        if (!triggers[triggerName]) {
            console.error(`Cannot find map trigger for ${triggerName}`);
            return;
        }

        const trigger = triggers[triggerName];

        if (!trigger.effects) {
            return;
        }

        for (const effect of trigger.effects) {
            if (effect.type === "script") {
                const code = effect.code;
                runCode(code, data);
            } else {
                console.error(`Unknown map trigger type ${effect.type}`);
            }
        }
    }
}