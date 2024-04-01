const data = this.entity.getData();

if (!data?.doorTrigger) {
    return;
}

const doorTrigger = data.doorTrigger;
const otherId = this.other.getId();

if (doorTrigger === otherId) {
    this.entity.removeFlag("inactive");
}