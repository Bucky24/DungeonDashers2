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

export const getMapMeta = (state) => {
	return {
		activeMap: state.map.activeMap,
		customMap: state.map.customMap
	};
}

export const inBattle = (state) => {
	return getActiveEnemies(state).length > 0;
}

export const getTriggers = (state) => {
	return state.map.triggers;
}

export const getPause = (state) => {
	return state.map.paused;
};

export const getCameraCenter = (state) => {
	return state.map.cameraCenter;
};

export const getDialog = (state) => {
	return state.map.dialog;
};
