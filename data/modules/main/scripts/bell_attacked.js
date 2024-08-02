const data = this.entity.getData();

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
        console.error(`Unknown bell effect ${effect.type}`);
    }
}

this.entity.removeFlag("attackable");

return false;