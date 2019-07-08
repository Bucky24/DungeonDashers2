import { getEnemyData } from '../getters/gameData';

export const Constants = {
	SET_GAME_TILES: 'GAME/SET_GAME_TILES',
	SET_GAME_CHARACTER: 'GAME/SET_GAME_CHARACTER',
	SET_MAP: 'GAME/SET_MAP',
	SET_OBJECT: 'GAME/SET_GAME_OBJECT',
	ACTIVATE_ENEMY: 'GAME/ACTIVATE_ENEMY',
	SET_ACTIVE_ENEMY: 'GAME/SET_ACTIVE_ENEMY',
	HARM_ENEMY: 'GAME/HARM_ENEMY'
};

const defaultState = {
	tiles: [],
	characters: [],
	walkable: [],
	objects: [],
	inactiveEnemies: [],
	activeEnemies: [],
	width: 0,
	height: 0,
};

export default (state = defaultState, action) => {
	if (action.type === Constants.SET_GAME_TILES) {
		const newState = {
			...state,
			tiles: action.tiles
		}
		
		return newState;
	} else if (action.type ===  Constants.SET_GAME_CHARACTER) {
		const newCharacters = [
			...state.characters
		];
		const newCharObj = {
			...newCharacters[action.index],
			...action.data
		};
		newCharacters[action.index] = newCharObj;
		const newState = {
			...state,
			characters: newCharacters
		};

		return newState;
	} else if (action.type === Constants.SET_MAP) {
		const newState = {
			...state,
			...action.data
		};
		
		return newState;
	} else if (action.type === Constants.SET_OBJECT) {
		const index = state.objects.findIndex((obj) => {
			return obj.id === action.id;
		});
		if (index === -1) {
			throw new Error(`Unable to find object for id ${action.id}`);
		}
		
		const newObjects = [...state.objects];
		newObjects[index] = {
			...state.objects[index],
			...action.data
		};
	
		return {
			...state,
			objects: newObjects
		};
	} else if (action.type === Constants.ACTIVATE_ENEMY) {
		const index = state.inactiveEnemies.findIndex((obj) => {
			return obj.id === action.id;
		});
		if (index === -1) {
			throw new Error(`Unable to find inactive enemy for id ${action.id}`);
		}
		
		const newInactiveEnemies = [...state.inactiveEnemies];
		const enemy = state.inactiveEnemies[index];
		const newActiveEnemies = [
			...state.activeEnemies,
			{
				...enemy
			}
		];
		newInactiveEnemies.splice(index, 1);
		
		return {
			...state,
			inactiveEnemies: newInactiveEnemies,
			activeEnemies: newActiveEnemies
		};
	} else if (action.type === Constants.SET_ACTIVE_ENEMY) {
		const index = state.activeEnemies.findIndex((obj) => {
			return obj.id === action.id;
		});
		if (index === -1) {
			throw new Error(`Unable to find active enemy for id ${action.id}`);
		}
		
		const newEnemies = [...state.activeEnemies];
		newEnemies[index] = {
			...state.activeEnemies[index],
			...action.data
		};
	
		return {
			...state,
			activeEnemies: newEnemies
		};
	} else if (action.type === Constants.HARM_ENEMY) {
		const index = state.activeEnemies.findIndex((obj) => {
			return obj.id === action.id;
		});
		if (index === -1) {
			throw new Error(`Unable to find active enemy for id ${action.id}`);
		}
		
		const enemy = {
			...state.activeEnemies[index]
		};
		
		const newEnemies = [...state.activeEnemies];
		enemy.hp -= action.amount;
		if (enemy.hp <= 0) {
			newEnemies.splice(index, 1);
		} else {
			newEnemies[index] = enemy;
		}
	
		return {
			...state,
			activeEnemies: newEnemies
		};
	} else {
		return state;
	}
}

// Actions

export const setTiles = (tiles) => {
	return {
		type: Constants.SET_GAME_TILES,
		tiles
	};
};

export const setCharacter = (data, index) => {
	return {
		type: Constants.SET_GAME_CHARACTER,
		data,
		index
	};
};

export const setMap = (data) => {
	return {
		type: Constants.SET_MAP,
		data
	};
}

export const setObject = (id, data) => {
	return {
		type: Constants.SET_OBJECT,
		id,
		data
	};
}

export const activateEnemy = (id) => {
	return {
		type: Constants.ACTIVATE_ENEMY,
		id
	};
}

export const setEnemy = (id, data) => {
	return {
		type: Constants.SET_ACTIVE_ENEMY,
		id,
		data
	};
}

export const harmEnemy = (id, amount) => {
	return {
		type: Constants.HARM_ENEMY,
		id,
		amount
	};
}
