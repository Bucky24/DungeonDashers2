export const Constants = {
	RESET_ALL: 'CAMP/RESET',
	ADD_GOLD: 'CAMP/ADD_GOLD'
};

const defaultState = {
	gold: 0
};

export default (state = defaultState, action) => {
	switch (action.type) {
		case Constants.RESET_ALL:
			return defaultState;
		case Constants.ADD_GOLD:
			
			return {
				...state,
				gold: Math.max(state.gold + action.amount, 0)
			};
		default:
			return state;
	}
}

// Actions

export const addGold = (amount) => {
	return {
		type: Constants.ADD_GOLD,
		amount
	};
};
