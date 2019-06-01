export const Constants = {
	SET_UI_PANE: 'UI/SET_UI_PANE'
};

export const Panes = {
	HOME: 'home',
	GAME: 'game'
};

const defaultState = {
	uiPane: Panes.GAME
};

export default (state = defaultState, action) => {
	switch (action.type) {
		case Constants.SET_UI_PANE:
			const newState = {
				...state,
				uiPane: action.pane
			}
			
			return newState;
		default:
			return state;
	}
}

// Actions

export const setUIPane = (pane) => {
	return {
		type: Constants.SET_UI_PANE,
		pane
	};
};
