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
