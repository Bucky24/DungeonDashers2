while (true) {
    if (this.entity.canTakeAction(this.game.COMBAT_ACTION.ATTACK)) {
        const objectsAround = this.game.getEntitiesWithinRange(this.entity.getPos().x, this.entity.getPos().y, 1);
        if (objectsAround.length > 0) {
            const target = objectsAround[0];
            await target.damage(2);
            this.entity.takeAction(this.game.COMBAT_ACTION.ATTACK);
            await this.game.sleep(500);
            continue;
        }
    }

    if (this.entity.canTakeAction(this.game.COMBAT_ACTION.MOVE)) {
        const objectsAround = this.game.getEntitiesWithinRange(this.entity.getPos().x, this.entity.getPos().y, 7);
        let closest = null;
        let distance = null;

        for (const object of objectsAround) {
            if (object.entityType !== 'character') {
                continue;
            }

            const newDistance = this.game.distanceBetweenEntities(this.entity, object);

            if (distance === null || newDistance < distance) {
                closest = object;
                distance = newDistance;
            }
        }

        if (!closest || distance <= 1) {
            break;
        }

        await this.entity.moveTowards(closest.getPos().x, closest.getPos().y, 1);
        this.entity.takeAction(this.game.COMBAT_ACTION.MOVE);
        await this.game.sleep(500);
        continue;
    }

    break;
}
