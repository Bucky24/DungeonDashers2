export const getTiles = (state) => {
	return state.game.tiles;
}

export const getCharacters = (state) => {
	return state.game.characters;
}

export const getWalkable = (state) => {
	return state.game.walkable;
}