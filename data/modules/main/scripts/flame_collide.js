const data = this.entity.getData();

if (!Array.isArray(data)) {
    console.error("Invalid data for flame entity, expected array");
    return;
}
if (this.entity.getState() !== "on") {
    return;
}
for (const effect of data) {
    if (effect.type === "open_door") {
        const doorId = effect.id;

        const entity = this.game.getEntityById(doorId);

        if (!entity) {
            console.error(`Cannot find door with id ${doorId}`);
        } else {
            entity.setState("open");
            entity.removeFlag("locked");
            entity.setFlag('nonblocking');
        }
    } else {
        console.error(`Unknown flame effect ${effect.type}`);
    }
}

this.entity.setState("off");

return false;