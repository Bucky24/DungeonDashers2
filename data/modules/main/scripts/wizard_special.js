if (!this.entity.canTakeAction(this.game.COMBAT_ACTION.SPECIAL)) {
    return;
} 

const targets = this.game.getTargets(
    this.game.TARGET_TYPE.ATTACKABLE,
    this.entity.getPos().x,
    this.entity.getPos().y,
    7,
);

const selectedTargetPosition = await this.game.userChooseLocation(
    this.entity.getPos().x,
    this.entity.getPos().y,
    2,
    2,
    targets.map((target) => {
        return {
            x: target.getPos().x,
            y: target.getPos().y,
        };
    }),
);

if (selectedTargetPosition) {
    let selectedTarget = null;
    for (const target of targets) {
        if (target.getPos().x === selectedTargetPosition.x && target.getPos().y === selectedTargetPosition.y) {
            selectedTarget = target;
            break;
        }
    }

    if (selectedTarget) {
        selectedTarget.damage(10);
        this.entity.takeAction(this.game.COMBAT_ACTION.SPECIAL);
    }
}