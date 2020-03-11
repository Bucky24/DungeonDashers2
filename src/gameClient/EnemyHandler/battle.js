import { sleep } from '../../common/utils/general';
import store from '../store';

import { getActiveEnemies, getCharacters } from '../store/getters/map';

import { harmCharacter } from '../store/ducks/map';

// this is entry point for enemy battle code
export default async function() {
	const state = store.getState();
	const dispatch = store.dispatch;

	const enemies = getActiveEnemies(state);
	const characters = getCharacters(state);
	
	const charactersByKey = characters.reduce((obj, character) => {
		const key = `${character.x}_${character.y}`;
		return {
			...obj,
			[key]: character
		};
	}, {});
	
	for (const enemy of enemies) {
		const key = `${enemy.x}_${enemy.y}`;
		
		const neighborKeys = [
			`${enemy.x-1}_${enemy.y-1}`,
			`${enemy.x}_${enemy.y-1}`,
			`${enemy.x+1}_${enemy.y-1}`,
			`${enemy.x+1}_${enemy.y}`,
			`${enemy.x+1}_${enemy.y+1}`,
			`${enemy.x}_${enemy.y+1}`,
			`${enemy.x-1}_${enemy.y+1}`,
			`${enemy.x-1}_${enemy.y}`,
		];
		
		const neighbors = []
		neighborKeys.forEach((key) => {
			if (charactersByKey[key]) {
				neighbors.push(charactersByKey[key]);
			}
		});
		
		if (neighbors.length > 0) {
			const first = neighbors[0];
			dispatch(harmCharacter(first.ident, 2));
		}
	}
};
