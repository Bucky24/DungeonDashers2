import useGameScriptContext from "./useGameScriptContext";
import runCode from "../utils/runCode";
import { getScripts } from "../data/moduleData";

export default function useRunScript(triggerEvent) {
    const gameScriptContext = useGameScriptContext(triggerEvent);

    return async (scriptId, data) => {
        const scripts = getScripts();
        const code = scripts[scriptId];
        if (!code) {
            console.error(`Can't find code for ${scriptId}`);
            return;
        }

        const finalData = {
            ...data,
            game: gameScriptContext,
        };

        return runCode(code, finalData);
    }
}