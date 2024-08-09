import { getObjects, getCharacters, getEnemies } from "../moduleData"; 

export default function getEntityData(entity) {
    if (entity.type === "object") {
        return getObjects()[entity.entity.type];
    } else if (entity.type === "character") {
        return getCharacters()[entity.entity.type];
    } else if (entity.type === "enemy") {
        return getEnemies()[entity.entity.type];
    } else {
        console.error(`getEntityData cannot handle type ${entity.type}`);
    }
}