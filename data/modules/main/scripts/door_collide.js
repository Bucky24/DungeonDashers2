if (this.entity.getFlags().includes("locked")) {
    return;
}

let opened = false;
if (this.entity.getState() === "closed_horiz") {
    this.entity.setState('open_horiz');
    this.entity.setFlag('nonblocking');
    opened = true;
} else if (this.entity.getState() === "closed_vert") {
    this.entity.setState("open_vert");
    this.entity.setFlag('nonblocking');
    opened = true;
}

if (opened) {
    // inform all enemies the door is opened, so they can spawn if they need to
    this.game.triggerEvent("door_opened", this.entity);
}