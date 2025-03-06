const h = `For ${this.entity.getId()} - `;
console.log(h,"starting");

const moveOff = async () => {
    console.log(h, "must move");
    const pos = [
        [this.entity.getPos().x + 1, this.entity.getPos().y],
        [this.entity.getPos().x, this.entity.getPos().y + 1],
        [this.entity.getPos().x - 1, this.entity.getPos().y],
        [this.entity.getPos().x, this.entity.getPos().y - 1],
    ];

    for (const p of pos) {
        const allowed = await this.entity.moveTowards(
            p[0],
            p[1],
            1,
            false,
        );
        if (allowed) {
            return true;
        }
    }
}

// unlikely we need to do this more than 100 times
for (let i=0;i<100;i++) {
    console.log(h, 'entity is at', this.entity.getPos());
    const objectsAround = this.game.getEntitiesWithinRange(this.entity.getPos().x, this.entity.getPos().y, 1);

    // if we are on top of something, we need to move off of it
    const objectsUnder = this.game.getEntitiesAt(this.entity.getPos().x, this.entity.getPos().y).filter(object => object.id !== this.entity.id);
    const onEntity = objectsUnder.length > 0;

    if (objectsAround.length > 0) {
        let validTarget = null;
        for (const target of objectsAround) {
            const target = objectsAround[0];
            if (target.entityType === "character") {
                validTarget = target;
                break;
            }
        }

        if (validTarget) {
            console.log(h,'we have a target');
            if (this.entity.canTakeAction(this.game.COMBAT_ACTION.ATTACK)) {
                console.log(h, "attacking");
                await validTarget.damage(2);
                this.entity.takeAction(this.game.COMBAT_ACTION.ATTACK);
                await this.game.sleep(500);
            } else {
                console.log(h, "we cannot attack");
                if (onEntity) {
                    // we need to move off and then finish
                    await moveOff();
                }
                break;
            }
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
        let attackableTarget = null;
        if (!closest || distance <= 1) {
            attackableTarget = closest;
        }

        const canMoveAndAttack = !this.entity.canTakeActions([
            [this.game.COMBAT_ACTION.MOVE, 1],
            [this.game.COMBAT_ACTION.ATTACK,1]
        ]);
        // so now we have to figure out what can we do and what situation are we in?

        let moved = false;
        if (attackableTarget) {
            console.log(h,"has attackable target");
            // we are ready to attack. But if we are on top of another enemy, we can only attack
            // if we would have enough AP to move at that point. If we do not, we should move away
            if (onEntity) {
                console.log(h, "is on an entity");
                if (canMoveAndAttack) {
                    // then we are good to go, we will attack next turn
                console.log(h, "can attack and move");
                } else {
                    // if we cannot move and attack, then we need to move OFF of this entity immediately
                    moved = await moveOff();
                }
            } else {
                // we are good to go, attack next turn!
                console.log(h, "ready to attack");
            }
        } else {
            // if no attackable target, but we have one, move towards them
            if (closest) {
                console.log(h, "moving towards target", closest.getPos());
                moved = await this.entity.moveTowards(
                    closest.getPos().x,
                    closest.getPos().y,
                    1,
                    false,
                );
                if (!moved) {
                    console.log(h, "unable to move in the right direction");
                }
            } else {
                // we are a sad enemy
                break;
            }
        }
        if (moved) {
            console.log(h,"was able to move and did move");
            this.entity.takeAction(this.game.COMBAT_ACTION.MOVE);
            await this.game.sleep(500);
        }

        // if we were unable to move closer, don't keep trying.
        if (!moved && closest && !attackableTarget) {
            // no point
            console.log(h, "unable to move towards target and cannot attack, giving up");
            break;
        }
        continue;
    }

    break;
}
