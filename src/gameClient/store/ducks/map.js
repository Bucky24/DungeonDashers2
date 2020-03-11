export const Constants = {
	SET_GAME_TILES: 'MAP/SET_GAME_TILES',
	SET_GAME_CHARACTER: 'MAP/SET_GAME_CHARACTER',
	SET_MAP: 'MAP/SET_MAP',
	SET_OBJECT: 'MAP/SET_GAME_OBJECT',
	ACTIVATE_ENEMY: 'MAP/ACTIVATE_ENEMY',
	SET_ACTIVE_ENEMY: 'MAP/SET_ACTIVE_ENEMY',
	HARM_ENEMY: 'MAP/HARM_ENEMY',
	REMOVE_OBJECT: 'MAP/REMOVE_OBJECT',
	SET_ACTIVE_CHARACTER: 'MAP/SET_ACTIVE_CHARACTER',
	SET_MAP_META: 'MAP/SET_MAP_META',
	HARM_CHARACTER: 'MAP/HARM_CHARACTER',
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
	activeMap: '',
	customMap: false
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
	} else if (action.type === Constants.REMOVE_OBJECT) {
		const newObjects = [
			...state.objects
		];
		const index = newObjects.findIndex((obj) => {
			return obj.id === action.id;
		});
		if (index === -1) {
			throw new Error(`Unable to find object for id ${action.id}`);
		}
		
		newObjects.splice(index, 1);
		
		return {
			...state,
			objects: newObjects
		};
	} else if (action.type === Constants.SET_ACTIVE_CHARACTER) {
		// this does two things. First, makes sure we spread the characters
		// so we don't modify original object. Second, set selected to false.
		// we will update appropriate character to true later.
		const newCharacters = state.characters.map((character) => {
			return {
				...character,
				selected: false
			}
		});
		// object has been spread, we can modify it
		newCharacters[action.index].selected = true;
		
		return {
			...state,
			characters: newCharacters
		};
	} else if (action.type === Constants.SET_MAP_META) {
		return {
			...state,
			activeMap: action.mapName,
			customMap: action.customMap
		}
	} else if (action.type === Constants.HARM_CHARACTER) {
		const index = state.characters.findIndex((obj) => {
			return obj.ident === action.ident;
		});
		if (index === -1) {
			throw new Error(`Unable to find active player for ident ${action.ident}`);
		}
		
		const character = {
			...state.characters[index]
		};
		
		const newCharacters = [...state.characters];
		character.hp -= action.amount;
		if (character.hp <= 0) {
			character.hp = 0;
		}
		newCharacters[index] = character;
	
		return {
			...state,
			characters: newCharacters,
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

export const harmCharacter = (ident, amount) => {
	return {
		type: Constants.HARM_CHARACTER,
		ident,
		amount
	};
}

export const removeObject = (id) => {
	return {
		type: Constants.REMOVE_OBJECT,
		id
	};
}

export const setActiveCharacter = (index) => {
	return {
		type: Constants.SET_ACTIVE_CHARACTER,
		index
	};
}

export const setMapMeta = (mapName, customMap) => {
	return {
		type: Constants.SET_MAP_META,
		mapName,
		customMap
	};
}
