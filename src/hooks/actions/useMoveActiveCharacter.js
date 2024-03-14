import { useContext } from "react";
import GameContext from "../../contexts/GameContext";
import MapContext, { TILE_TYPE } from "../../contexts/MapContext";
import ModuleContext from "../../contexts/ModuleContext";

export default function useMoveActiveCharacter() {
    const { activeCharacterIndex, moveCharacter, characters, getEntitiesAtPosition } = useContext(GameContext);
    const { getTile } = useContext(MapContext);
    const { tiles } = useContext(ModuleContext);

    return (xOff, yOff) => {
        if (xOff === 0 && yOff === 0) {
            return;
        }

        const character = characters[activeCharacterIndex];
        if (!character) {
            console.warn("No active character");
            return;
        }

        const newX = character.x + xOff;
        const newY = character.y + yOff;

        const tile = getTile(newX, newY);
        const tileData = tiles[tile.tile];

        if (tileData?.type !== TILE_TYPE.GROUND) {
            return;
        }

        const entities = getEntitiesAtPosition(newX, newY);
        if (entities.length > 0) {
            return;
        }

        moveCharacter(activeCharacterIndex, character.x + xOff, character.y + yOff);
    }
}