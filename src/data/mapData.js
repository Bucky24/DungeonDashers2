let mapData = {};
let computedData = {};

function updateComputedData() {
    computedData = {
        tiles: mapData.tiles.reduce((obj, tile) => {
            return {
                ...obj,
                [`${tile.x}_${tile.y}`]: tile,
            };
        }),
    };
}

export function setMap(data) {
    mapData.tiles = data.tiles;

    updateComputedData();
}

export function getTiles() {
    return  mapData.tiles;
}

export function getTile(x, y) {
    return computedData.tiles[`${x}_${y}`];
}