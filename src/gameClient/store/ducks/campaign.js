export const Constants = {
	RESET_ALL: 'CAMP/RESET',
	ADD_GOLD: 'CAMP/ADD_GOLD',
	ADD_CHARACTER: 'CAMP/ADD_CHARACTER',
	SET_ACTIVE_CAMPAIGN: 'CAMP/SET_ACTIVE_CAMPAIGN',
	ADD_EQUIPMENT: 'CAMP/ADD_EQUIPMENT'
};

const defaultState = {
	gold: 0,
	characterData: {},
	campaign: null,
	floatingEquipment: []
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
		case Constants.ADD_CHARACTER:
			if (state.characterData[action.id]) {
				return state;
			}

			return {
				...state,
				characterData: {
					...state.characterData,
					[action.id]: {
						weapon: null,
						armor: null,
						shield: null
					}
				}
			}
		case Constants.SET_ACTIVE_CAMPAIGN:
			return {
				...state,
				campaign: action.campaign
			}
		case Constants.ADD_EQUIPMENT:
			return {
				...state,
				floatingEquipment: [
					...state.floatingEquipment,
					action.equipment
				]
			}
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

export const createCharacter = (id) => {
	return {
		type: Constants.ADD_CHARACTER,
		id
	};
};

export const setActiveCampaign = (campaign) => {
	return {
		type: Constants.SET_ACTIVE_CAMPAIGN,
		campaign
	};
};

export const addEquipment = (equipment) => {
	return {
		type: Constants.ADD_EQUIPMENT,
		equipment
	};
};
