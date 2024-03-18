import { useContext } from "react";
import ModuleContext from "../contexts/ModuleContext";
import useGameScriptContext from "./useGameScriptContext";

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

        const wrappedCode = `return (async () => {\n${code}\n})()`;

        let myFunc = new Function(wrappedCode);
        myFunc = myFunc.bind(finalData);

        await myFunc();
    }
}