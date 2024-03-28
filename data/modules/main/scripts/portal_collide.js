// loop over all portals that exist
// if all of them have a character on them
// then the player wins the game

const portals = this.game.getEntitiesOfType("object", "main_portal1");
let allFilled = true;
for (const portal of portals) {
    const objects = this.game.getEntitiesAt(portal.getPos().x, portal.getPos().y);
    const characters = objects.filter((object) => object.entityType === "character");
    if (characters.length === 0) {
        allFilled = false;
    }
}

if (!allFilled) {
    this.game.victory();
}