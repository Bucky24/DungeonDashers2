const userResponse = await this.game.userChooseLocation(
    this.entity.getPos().x,
    this.entity.getPos().y,
    2,
    2,
    this.game.LOCATION.STRAIGHT_LINES,
);
if (!userResponse) {
    return;
}

const { x, y } = userResponse;

await this.entity.moveTo(x, y);