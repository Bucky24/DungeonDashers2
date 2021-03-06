export const Constants = {
	SET_BASE_ENEMIES: 'GAME_DATA/SET_BASE_ENEMIES',
	SET_BASE_OBJECTS: 'GAME_DATA/SET_BASE_OBJECTS',
	SET_BASE_CHARACTERS: 'GAME_DATA/SET_BASE_CHARACTERS',
	SET_BASE_EQUIPMENT: 'GAME_DATA/SET_BASE_EQUIPMENT',
};

const defaultState = {
	baseEnemies: [],
	baseObjects: [],
	baseCharacters: [],
	baseEquipment: [],
};

export default (state = defaultState, action) => {
	if (action.type === Constants.SET_BASE_ENEMIES) {
		const newState = {
			...state,
			baseEnemies: action.enemies
		}
		
		return newState;
	} else if (action.type === Constants.SET_BASE_OBJECTS) {
		const newState = {
			...state,
			baseObjects: action.objects
		}
		
		return newState;
	} else if (action.type === Constants.SET_BASE_CHARACTERS) {
		const newState = {
			...state,
			baseCharacters: action.characters
		}
		
		return newState;
	} else if (action.type === Constants.SET_BASE_EQUIPMENT) {
		const newState = {
			...state,
			baseEquipment: action.equipment
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

export const setBaseObjects = (objects) => {
	return {
		type: Constants.SET_BASE_OBJECTS,
		objects
	};
};

export const setBaseCharacters = (characters) => {
	return {
		type: Constants.SET_BASE_CHARACTERS,
		characters
	};
};

export const setBaseEquipment = (equipment) => {
	return {
		type: Constants.SET_BASE_EQUIPMENT,
		equipment
	};
};
