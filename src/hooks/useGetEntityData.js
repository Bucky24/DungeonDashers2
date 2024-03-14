import { useContext } from "react";

import ModuleContext from "../contexts/ModuleContext";

export default function useGetEntityData() {
    const { objects, characters } = useContext(ModuleContext);

    return (entity) => {
        if (entity.type === "object") {
            return objects[entity.entity.type];
        } else {
            return characters[entity.entity.type];
        }
    }
}