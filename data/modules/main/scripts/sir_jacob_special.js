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
    let obj = getObjectAtCoords(curX, curY, ObjectType.DESTROYABLE_OBJECTS);
    if (obj) {
        obj.damage(100);
        self.moveTo(curX, curY);
        await sleep(100);
        continue;
    }
    if (!isSpaceWalkable(curX, curY) ||getObjectAtCoords(curX, curY, ObjectType.CHARACTERS)) {
        break;
    }
    obj = getObjectAtCoords(curX, curY, ObjectType.ENEMIES);
    if (obj) {
        break;
    }
    obj = getObjectAtCoords(curX, curY, ObjectType.OBJECTS);
    if (obj) {
        break;
    }
    await self.moveTo(curX, curY);
    await sleep(100);
}