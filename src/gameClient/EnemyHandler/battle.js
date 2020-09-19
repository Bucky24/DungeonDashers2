import store from '../store';

import { getActiveEnemies } from '../store/getters/map';
import { getEnemyData } from '../store/getters/gameData';
import { moveEnemy } from '../store/ducks/map';

import { executeScript } from '../scriptHandler/scriptHandler';

// this is entry point for enemy battle code
export default async function() {
	const state = store.getState();
	const dispatch = store.dispatch;

	console.log("Running enemy ai");

	const enemies = getActiveEnemies(state);
	const allEnemyData = getEnemyData(state);
	
	for (const enemy of enemies) {
		if (!enemy) {
			continue;
		}
		const enemyData = allEnemyData[enemy.type];

		if (!enemyData) {
			console.error("Cannot find data for enemy type " + enemy.type);
			continue;
		}

		if (enemyData.script) {
			const context = {
				id: enemy.id,
				actionPoints: enemy.actionPoints,
				x: enemy.x,
				y: enemy.y,
				moveTo(x, y) {
					dispatch(moveEnemy(enemy.id, x, y));
					this.x = x;
					this.y = y;
				},
			};

			try {
				await executeScript(enemyData.script, context);
			} catch (error) {
				console.error("Unable to execute AI script for " + enemy.type + ": " + error);
			}
		}
	}

	console.log("Done running enemy ai");
};
