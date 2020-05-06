export const Constants = {
	RESET_ALL: 'CAMP/RESET',
	ADD_GOLD: 'CAMP/ADD_GOLD',
	ADD_CHARACTER: 'CAMP/ADD_CHARACTER',
	SET_ACTIVE_CAMPAIGN: 'CAMP/SET_ACTIVE_CAMPAIGN',
	ADD_EQUIPMENT: 'CAMP/ADD_EQUIPMENT',
	REMOVE_EQUIPMENT: 'CAMP/REMOVE_EQUIPMENT',
	SET_MAPS: 'CAMP/SET_MAPS',
	SET_CURRENT_MAP: 'CAMP/SET_CURRENT_MAP',
	SET_IS_CUSTOM: 'CAMP/SET_IS_CUSTOM',
};

const defaultState = {
	gold: 0,
	characterData: {},
	campaign: null,
	floatingEquipment: [],
	campaignMaps: [],
	currentMap: null,
	isCustom: false,
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
		case Constants.REMOVE_EQUIPMENT:
			return {
				...state,
				floatingEquipment: state.floatingEquipment.filter((item, index) => {
					return index !== action.index;
				}),
			}
		case Constants.SET_MAPS:
			return {
				...state,
				campaignMaps: action.maps,
			};
		case Constants.SET_CURRENT_MAP:
			return {
				...state,
				currentMap: action.map,
			};
		case Constants.SET_IS_CUSTOM:
			return {
				...state,
				isCustom: action.custom,
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

export const removeEquipment = (index) => {
	return {
		type: Constants.REMOVE_EQUIPMENT,
		index,
	};
};

export const setMaps = (maps) => {
	return {
		type: Constants.SET_MAPS,
		maps,
	};
};

export const setCurrentMap = (map) => {
	return {
		type: Constants.SET_CURRENT_MAP,
		map,
	};
};

export const setIsCustom = (custom) => {
	return {
		type: Constants.SET_IS_CUSTOM,
		custom,
	};
};
