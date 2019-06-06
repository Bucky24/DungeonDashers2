export const Constants = {
	SET_GAME_TILES: 'GAME/SET_GAME_TILES',
	SET_GAME_CHARACTER: 'GAME/SET_GAME_CHARACTER',
	SET_GAME: 'GAME/SET_GAME',
	SET_OBJECT: 'GAME/SET_GAME_OBJECt'
};

const defaultState = {
	tiles: [],
	characters: [],
	walkable: [],
	objects: [],
	width: 0,
	height: 0,
};

const WalkableTiles = [
	'ground1'
];

const collidableObjects = [
	
];

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
		const newState = {
			...state,
			tiles: action.data.tiles,
			characters: action.data.characters,
			objects: newObjects,
			width: action.data.width,
			height: action.data.height,
			walkable: getWalkable(action.data.tiles, newObjects)
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
