export default function getEntityFlags(entity, entityData) {
    console.log(entity, entityData);
    const myFlags = entity.entity.flags || [];
    if (entityData?.flags) {
        for (const flag of entityData.flags) {
            if (!myFlags.includes(flag)) {
                myFlags.push(flag);
            }
        }
    }

    if (entity.entity.antiFlags) {
        // if it's set in anitflags, means we've tried to unset it before
        // so make sure it's actually removed from our result
        for (const flag of entity.entity.antiFlags) {
            if (myFlags.includes(flag)) {
                const index = myFlags.indexOf(flag);
                myFlags.splice(index, 1);
            }
        }
    }

    return myFlags;
}