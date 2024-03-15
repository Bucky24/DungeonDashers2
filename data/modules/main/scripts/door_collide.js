if (this.entity.getState() === "closed_horiz") {
    this.entity.setState('open_horiz');
    this.entity.setFlag('nonblocking');
} else if (this.entity.getState() === "closed_vert") {
    this.entity.setState("open_vert");
    this.entity.setFlag('nonblocking');
}