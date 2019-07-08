export const Constants = {
	SET_BASE_ENEMIES: 'GAME_DATA/SET_BASE_ENEMIES'
};

const defaultState = {
	baseEnemies: []
};

export default (state = defaultState, action) => {
	if (action.type === Constants.SET_BASE_ENEMIES) {
		const newState = {
			...state,
			baseEnemies: action.enemies
		}
		
		return newState;
	} else {
		return state;
	}
}

// Actions

export const setBaseEnemies = (enemies) => {
	return {
		type: Constants.SET_BASE_ENEMIES,
		enemies
	};
};