export const getTiles = (state) => {
	return state.game.tiles || [];
}

export const getCharacters = (state) => {
	return state.game.characters || [];
}

export const getWalkable = (state) => {
	return state.game.walkable || [];
}

export const getObjects = (state) => {
	return state.game.objects || [];
}

export const getInactiveEnemies = (state) => {
	return state.game.inactiveEnemies || [];
}

export const getActiveEnemies = (state) => {
	return state.game.activeEnemies || [];
}
