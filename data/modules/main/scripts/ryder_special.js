const { x, y } = await userChooseLocation(2, 2, LOCATION.STRAIGHT_LINES);
await this.moveTo(x, y);