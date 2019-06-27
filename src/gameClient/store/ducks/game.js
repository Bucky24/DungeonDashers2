export const Constants = {
	SET_GAME_TILES: 'GAME/SET_GAME_TILES',
	SET_GAME_CHARACTER: 'GAME/SET_GAME_CHARACTER',
	SET_GAME: 'GAME/SET_GAME',
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

const WalkableTiles = [
	'ground1'
];

const collidableObjects = [
	
];

const enemyBaseStats = {
	bat: {
		hp: 10
	}
};

const getWalkable = (tiles, objects) => {
	const objectKeys = objects.map((object) => {
		if (collidableObjects.includes(object.type)) {
			return object.key;
		}
	});
	const walkable = tiles.map((tile) => {
		if (WalkableTiles.includes(tile.tile)) {
			return {
				x: tile.x,
				y: tile.y
			};
		}
	}).filter((data) => {
		return !!data
	})
	.map((data) => {
		return `${data.x}_${data.y}`;
	})
	.filter((key) => {
		return !objectKeys.includes(key);
	});
	
	return walkable;
}

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
	} else if (action.type === Constants.SET_GAME) {
		const newObjects = action.data.objects.map((object) => {
			return {
				...object,
				key: `${object.x}_${object.y}`
			};
		});
		// any enemy without a trigger is active immediately
		const inactiveEnemies = [];
		const activeEnemies = [];
		action.data.enemies.forEach((enemy) => {
			if (enemy.trigger) {
				inactiveEnemies.push(enemy);
			} else {
				const newEnemy = {
					...enemy
				};
				newEnemy.hp = enemyBaseStats[enemy.type].hp;
				activeEnemies.push(newEnemy);
			}
		})
		
		const newState = {
			...state,
			tiles: action.data.tiles,
			characters: action.data.characters,
			objects: newObjects,
			width: action.data.width,
			height: action.data.height,
			walkable: getWalkable(action.data.tiles, newObjects),
			inactiveEnemies,
			activeEnemies
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
				...enemy,
				...enemyBaseStats[enemy.type]
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

export const setGame = (data) => {
	return {
		type: Constants.SET_GAME,
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
