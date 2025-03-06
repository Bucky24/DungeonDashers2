// loop over all portals that exist
// if all of them have a character on them
// then the player wins the game

const portals = this.game.getEntitiesOfType("object", "main_portal1");
let allFilled = true;
for (const portal of portals) {
    const objects = this.game.getEntitiesAt(portal.getPos().x, portal.getPos().y);
    let characters = objects.filter((object) => object.entityType === "character");
    // we know a character has stepped onto our current portal, so if this is our portal
    // that triggered the event, then we know it's a hit
    if (portal.id === this.entity.id) {
        characters.push(this.other);
    } else {
        // if this is not our current portal, then the current other character CANNOT have stepped onto it, so we must filter them
        characters = characters.filter((character) => character.id !== this.other.id);
    }

    if (characters.length === 0) {
        allFilled = false;
    }
}

if (allFilled) {
    this.game.victory();
}