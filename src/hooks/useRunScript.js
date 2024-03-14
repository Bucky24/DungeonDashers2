import { useContext } from "react";
import ModuleContext from "../contexts/ModuleContext";

export default function useRunScript() {
    const { scripts } = useContext(ModuleContext);

    return async (scriptId, data) => {
        const code = scripts[scriptId];
        if (!code) {
            console.error(`Can't find code for ${scriptId}`);
            return;
        }

        let myFunc = new Function(code);
        myFunc = myFunc.bind(data);

        await myFunc();
    }
}