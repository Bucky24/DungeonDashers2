
if (this.entity.getState() === "closed") {
    const data = this.entity.getData();
    this.entity.setState("open");
    this.entity.setFlag("nonblocking");

    if (!data) {
        return;
    }

    for (const item of data) {
        this.game.giveTreasure(item.type, item.amount, item.data);
    }
}