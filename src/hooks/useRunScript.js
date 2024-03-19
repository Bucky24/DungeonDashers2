import { useContext } from "react";
import ModuleContext from "../contexts/ModuleContext";
import useGameScriptContext from "./useGameScriptContext";
import runCode from "../utils/runCode";

export default function useRunScript() {
    const { scripts } = useContext(ModuleContext);
    const gameScriptContext = useGameScriptContext();

    return async (scriptId, data) => {
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