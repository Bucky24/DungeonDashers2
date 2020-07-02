export const Constants = {
	SET_UI_PANE: 'UI/SET_UI_PANE',
	SET_CHOOSE_LOC: 'UI/SET_CHOOSE_LOC',
};

export const Panes = {
	LOAD: 'load',
	HOME: 'home',
	GAME: 'game',
	NEW_MAP_SELECT: 'new_map_select',
	SAVE_LOAD: 'save_load',
	LOAD_GAME_SELECT: 'load_game_select',
	WON_GAME: 'won_game',
	GAME_EQUIPMENT: 'game_equipment',
	CAMPAIGN: 'campaign',
};

const defaultState = {
	uiPane: Panes.LOAD,
	choosingLocation: false,
	locMin: null,
	locMax: null,
	locType: null,
	locStartX: null,
	logStartY: null,
};

export default (state = defaultState, action) => {
	switch (action.type) {
		case Constants.SET_UI_PANE:
			const newState = {
				...state,
				uiPane: action.pane
			}
			
			return newState;
		case Constants.SET_CHOOSE_LOC:
			return {
				...state,
				choosingLocation: action.choosing,
				locMin: action.min,
				locMax: action.max,
				locType: action.locType,
				locStartX: action.startX,
				locStartY: action.startY,
			};
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

export const setChooseLoc = (choosing, min, max, type, startX, startY) => {
	return {
		type: Constants.SET_CHOOSE_LOC,
		choosing,
		min,
		max,
		locType: type,
		startX,
		startY,
	};
};
