export const Constants = {
	SET_GAME_TILES: 'UI/SET_GAME_TILES',
	SET_GAME_CHARACTER: 'UI/SET_GAME_CHARACTER',
	SET_GAME: 'UI/SET_GAME'
};

const defaultState = {
	tiles: [],
	characters: [],
	walkable: [],
	width: 0,
	height: 0,
};

const WalkableTiles = [
	'ground1'
];

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
		const walkable = action.data.tiles.map((tile) => {
			if (WalkableTiles.includes(tile.tile)) {
				return `${tile.x}_${tile.y}`;
			}
		}).filter((key) => {
			return !!key
		});
		
		const newState = {
			...state,
			tiles: action.data.tiles,
			characters: action.data.characters,
			width: action.data.width,
			height: action.data.height,
			walkable
		};
		
		return newState;
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
