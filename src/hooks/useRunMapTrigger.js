import { useContext } from "react";

import MapContext from "../contexts/MapContext";

export default function useRunMapTrigger() {
    const { triggers } = useContext(MapContext);

    return async (triggerName) => {
        if (!triggers[triggerName]) {
            console.error(`Cannot find map trigger for ${triggerName}`);
            return;
        }

        const trigger = triggers[triggerName];
        console.log(trigger);
    }
}