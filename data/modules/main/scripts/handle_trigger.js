if (this.entity.getState() === "disabled") {
    return;
}

const triggerData = this.entity.getData();

for (const effect of triggerData) {
    const { type, name, disable } = effect;
    if (type === "map_trigger") {
        this.game.runTrigger(name);
    }
    if (disable) {
        this.entity.setState("disabled");
    }
}