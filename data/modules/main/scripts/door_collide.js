if (this.getState() === "open_horiz" || this.getState() == "open_vert") {
    return;
} else if (this.getState() === "closed_horiz") {
    this.setState('open_horiz');
} else if (this.getState() === "closed_vert") {
    this.setState("open_vert");
}