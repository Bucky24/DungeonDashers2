const pos = this.entity.getPos();
const coord = await this.game.userChooseLocation(
    pos.x,
    pos.y,
    1,
    1,
    this.game.LOCATION.STRAIGHT_LINES,
);
if (!coord) {
    return;
}
const { x, y } = coord;
const xOff = x - pos.x;
const yOff = y - pos.y;
let curX = pos.x;
let curY = pos.y;
while (true) {
    curX += xOff;
    curY += yOff;

    // can the character even get there
    if (!this.game.isAccessible(this.game.MOVEMENT.WALKING, curX, curY)) {
        break;
    }

    // can they destroy everything or at least pass over it
    const entities = this.game.getEntitiesAt(curX, curY);
    const collidableEntities = entities.filter((entity) => {
        return !entity.getFlags().includes("nonblocking");
    })
    let canDestroyAll = true;
    for (const entity of collidableEntities) {
        if (!entity.getFlags().includes("destructable")) {
            canDestroyAll = false;
            break;
        }
    }
    if (!canDestroyAll) {
        break;
    }

    // move
    await this.game.sleep(100);
    await this.entity.moveTo(curX, curY, true);

    // do destruction. Has to happen after movement because otherwise
    // any collision events will explode (since object no longer exists)
    for (const entity of collidableEntities) {
        entity.damage(100);
    }
}