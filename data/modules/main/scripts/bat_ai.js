while (true) {
    if (hasActionPointsFor(Action.ATTACK)) {
        const objectsAround = getObjectsWithinRange(ObjectType.CHARACTERS, null, 1);
        if (objectsAround.length > 0) {
            const target = objectsAround[0];
            await attackTarget(target);
            continue;
        }
    }

    if (hasActionPointsFor(Action.MOVE)) {
        const objectNearby = getClosestObjectWithinRange(ObjectType.CHARACTERS, null, 7);
        if (objectNearby) {
            await moveTowards(objectNearby);
    continue;
        }
    }

    break;
}
