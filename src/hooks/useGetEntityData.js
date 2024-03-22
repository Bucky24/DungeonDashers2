import { useContext } from "react";

import ModuleContext from "../contexts/ModuleContext";

export default function useGetEntityData() {
    const { objects, characters, enemies } = useContext(ModuleContext);

    return (entity) => {
        if (entity.type === "object") {
            return objects[entity.entity.type];
        } else if (entity.type === "character") {
            return characters[entity.entity.type];
        } else if (entity.type === "enemy") {
            return enemies[entity.entity.type];
        } else {
            console.error(`getEntityData cannot handle type ${entity.type}`);
        }
    }
}