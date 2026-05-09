if (!this.other.entityType === "character") return;

const chars = this.game.getEntitiesOfType("character");

for (const char of chars) {
    if (char.type === this.other.type) continue;
    
    const location = this.game.findValidLocation(this.entity.x, this.entity.y, 1, 1,  this.game.LOCATION.CIRCLE, [this.game.LOCATION_FILTER.WALKABLE, this.game.LOCATION_FILTER.OPEN]);
    
    char.moveTo(location.x, location.y, true);
}