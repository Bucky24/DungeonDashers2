export const getEnemyData = (state) => {
	// eventually custom enemies will be here too
	const enemyList = [
		...state.gameData.baseEnemies || []
	];
	
	const map = enemyList.reduce((obj, enemy) => {
		return {
			...obj,
			[enemy.type]: enemy
		}
	}, {});
	
	return map;
}

export const getObjectData = (state) => {
	// eventually custom enemies will be here too
	const objectList = [
		...state.gameData.baseObjects || []
	];
	
	const map = objectList.reduce((list, obj) => {
		return {
			...list,
			[obj.type]: obj
		}
	}, {});
	
	return map;
}

export const getCharacterData = (state) => {
	// eventually custom characters will be here too
	const characterList = [
		...state.gameData.baseCharacters || []
	];
	
	const map = characterList.reduce((list, obj) => {
		return {
			...list,
			[obj.ident]: obj
		}
	}, {});
	
	return map;
}