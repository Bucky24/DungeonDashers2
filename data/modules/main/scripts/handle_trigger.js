if (this.entity.getState() === "disabled") {
    return;
}

const effects = this.entity.getData();

for (const effect of effects) {
    const { type, name, disable } = effect;
    if (type === "map_trigger") {
        this.game.runTrigger(name);
    }
    if (disable) {
        this.entity.setState("disabled");
    }
}