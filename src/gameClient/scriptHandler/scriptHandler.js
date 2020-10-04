import store from "../store";
import { sleep } from "../../common/utils/general";

import { STRAIGHT_LINES, Action, POINTS_FOR_MOVE, POINTS_FOR_ATTACK, ObjectType } from './constants';
import { onOnce } from "../eventEmitter/emitter";

import { setChooseLoc } from '../store/ducks/ui';
import { getCharacters, getActiveEnemies } from '../store/getters/map';
import { harmCharacter, setCharacter } from "../store/ducks/map";

const scripts = {};

export const processScript = (code, name) => {
	const imports = [
		"userChooseLocation", "STRAIGHT_LINES", "getSelf", "Action", "hasActionPointsFor",
		"getObjectsWithinRange", "ObjectType", "getClosestObjectWithinRange", "moveTowards",
		"attackTarget",
	];
	let importString = "";
	if (imports.length > 0) {
		importString = `{ ${imports.join(",")} }`;
	}
	const finalCode = `const ${name} = async function(${importString}) {\n${code}\n}; scripts["${name}"] = ${name};`;
	
	try {
		eval(finalCode);
	} catch (error) {
		throw new Error(`Error building script ${name}: ${error.message}`);
	}
}

const isSpaceEmpty = (x, y) => {
	const characters =  getCharacters(store.getState());
	const enemies = getActiveEnemies(store.getState());

	for (const char of characters) {
		if (char.x === x && char.y === y) {
			return false;
		}
	}

	for (const en of enemies) {
		if (en.x === x && en.y === y) {
			return false;
		}
	}

	return true;
}

const getGlobalContext = (context) => {
	return {
		userChooseLocation: (min, max, dir) => {
			return new Promise((resolve, reject) => {
				onOnce("locationClicked", (loc) => {
					resolve(loc);
				})
				store.dispatch(setChooseLoc(true, min, max, dir, context.x, context.y));
			});
		},
		getSelf: () => {
			return context;
		},
		hasActionPointsFor: (type) => {
			console.log("points", context.actionPoints);
			if (type === Action.MOVE) {
				return context.actionPoints >= POINTS_FOR_MOVE;
			} else if (type === Action.ATTACK) {
				return context.actionPoints >= POINTS_FOR_ATTACK;
			}

			return false;
		},
		getObjectsWithinRange: (type, subType, distance) => {
			let dataSet = null;
			let contextFn = null;
			if (type === ObjectType.CHARACTERS) {
				dataSet = getCharacters(store.getState());
				contextFn = getContextFromCharacter;
			}

			if (!dataSet) {
				return [];
			}

			let results = [];

			for (const data of dataSet) {
				const dist = Math.round(Math.sqrt(Math.pow(context.x - data.x, 2) + Math.pow(context.y - data.y, 2)));
				if (dist <= distance) {
					results.push(contextFn(data));
				}
			}

			return results;
		},
		getClosestObjectWithinRange: (type, subType, distance) => {
			let dataSet = null;
			let contextFn = null;
			if (type === ObjectType.CHARACTERS) {
				dataSet = getCharacters(store.getState());
				contextFn = getContextFromCharacter;
			}

			if (!dataSet) {
				return null;
			}

			let closest = null;
			let closeDist = null;

			for (const data of dataSet) {
				const dist = Math.round(Math.sqrt(Math.pow(context.x - data.x, 2) + Math.pow(context.y - data.y, 2)));
				if ((dist < closeDist || closeDist == null) && dist <= distance) {
					closest = contextFn(data);
					closeDist = dist;
				}
			}

			return closest;
		},
		moveTowards: async (otherContext) => {
			if (context.actionPoints < POINTS_FOR_MOVE) {
				return;
			}

			// has to be here right now otherwise scripts might infinite loop
			context.actionPoints -= POINTS_FOR_MOVE;

			let newX = context.x;
			let newY = context.y;

			if (otherContext.x > newX) {
				newX += 1;
			} else if (otherContext.x < newX) {
				newX -= 1;
			}

			if (otherContext.y > newY) {
				newY += 1;
			} else if (otherContext.y < newY) {
				newY -= 1;
			}

			// don't allow moving on top of the target
			// we'll need to modify this at some point probably
			if (otherContext.x == newX && otherContext.y == newY) {
				return;
			}

			// don't allow moving on top of anything
			if (!isSpaceEmpty(newX, newY)) {
				return;
			}

			context.moveTo(newX, newY);

			await sleep(250);
		},
		attackTarget: async (otherContext) => {
			if (context.actionPoints < POINTS_FOR_ATTACK) {
				return;
			}
			context.actionPoints -= POINTS_FOR_ATTACK;

			otherContext.damage(5);

			await sleep(250);
		},
		STRAIGHT_LINES,
		Action,
		ObjectType,
	};
}

const getContextFromCharacter = (character) => {
	const characters = getCharacters(store.getState());
	const findIdent = character.ident;
	const activeCharIndex = characters.findIndex(({ ident }) => {
		return ident === findIdent;
	});

	return {
		x: character.x,
		y: character.y,
		moveTo: (x, y) => {
			store.dispatch(setCharacter({
				x,
				y,
			}, activeCharIndex));
		},
		damage: (amount) => {
			store.dispatch(harmCharacter(findIdent, amount));
		},
	};
}

export const executeScript = async (name, context) => {
	if (!scripts[name]) {
		throw new Error(`Cannot find script with name ${name}`);
	}
	
	const fn = scripts[name];
	const globalContext = getGlobalContext(context);
	
	try {
		await fn(globalContext);
	} catch (error) {
		console.error("Script: " + fn);
		throw new Error(`Error executing script ${name}: ${error.message}`);
	}
}

export const executeScriptAsCharacter = (name, charIdent) => {
	const characters = getCharacters(store.getState());
	const activeCharIndex = characters.findIndex(({ ident }) => {
		return ident === charIdent;
	});
	console.log("execute script as character?", charIdent, name);
	const activeChar = characters[activeCharIndex];
	return executeScript(name, getContextFromCharacter(activeChar));
}