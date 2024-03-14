function useGetObjectContext() {
    // this should be the object from GameContext
    return (objectData) => {
        return {};
    }
}

function useGetCharacterContext() {
    // this should be the object from GameContext
    return (characterData) => {
        return {};
    }
}

export default function useGetEntityContext() {
    const getObjectContext = useGetObjectContext();
    const getCharacterContext = useGetCharacterContext();

    return (entity) => {
        if (entity.type === "object") {
            return getObjectContext(entity.entity);
        } else if (entity.type === "character") {
            return getCharacterContext(entity.entity);
        }
    }
}
