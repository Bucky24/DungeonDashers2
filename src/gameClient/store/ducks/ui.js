export const Constants = {
	SET_UI_PANE: 'UI/SET_UI_PANE'
};

export const Panes = {
	LOAD: 'load',
	HOME: 'home',
	GAME: 'game',
	NEW_MAP_SELECT: 'new_map_select',
	SAVE_LOAD: 'save_load',
	LOAD_GAME_SELECT: 'load_game_select',
	WON_GAME: 'won_game'
};

const defaultState = {
	uiPane: Panes.LOAD
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
