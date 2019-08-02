export const Constants = {
	SET_GAME_FILE: 'GAME/SET_GAME_FILE',
	SET_GAME_MAP: 'GAME/SET_GAME_MAP'
};

const defaultState = {
	fileName: '',
	map: {}
};

export default (state = defaultState, action) => {
	if (action.type === Constants.SET_GAME_FILE) {
		const newState = {
			...state,
			fileName: action.file
		}
		
		return newState;
	} else if (action.type === Constants.SET_GAME_MAP) {
		const newState = {
			...state,
			map: action.map
		}
		
		return newState;
	} else {
		return state;
	}
}

// Actions

export const setFile = (file) => {
	return {
		type: Constants.SET_GAME_FILE,
		file
	};
};

export const setMap = (map) => {
	return {
		type: Constants.SET_GAME_MAP,
		map
	}
};
