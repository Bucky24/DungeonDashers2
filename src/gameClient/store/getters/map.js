export const getTiles = (state) => {
	return state.map.tiles || [];
}

export const getCharacters = (state) => {
	return state.map.characters || [];
}

export const getWalkable = (state) => {
	return state.map.walkable || [];
}

export const getObjects = (state) => {
	return state.map.objects || [];
}

export const getInactiveEnemies = (state) => {
	return state.map.inactiveEnemies || [];
}

export const getActiveEnemies = (state) => {
	return state.map.activeEnemies || [];
}