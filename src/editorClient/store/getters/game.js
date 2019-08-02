export const getFile = (state) => {
	return state.game.fileName || '';
}

export const getMap = (state) => {
	return state.game.map || {};
}
