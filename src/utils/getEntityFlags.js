export default function getEntityFlags(entity, entityData) {
    const myFlags = entity.entity.flags || [];
    if (entityData?.flags) {
        for (const flag of entityData.flags) {
            if (!myFlags.includes(flag)) {
                myFlags.push(flag);
            }
        }
    }

    return myFlags;
}