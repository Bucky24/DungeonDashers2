import store from "../store";
import { sleep } from "../../common/utils/general";

import { STRAIGHT_LINES, Action, POINTS_FOR_MOVE, POINTS_FOR_ATTACK, ObjectType } from './constants';
import { onOnce } from "../eventEmitter/emitter";

import { setChooseLoc } from '../store/ducks/ui';
import { getLivingCharacters, getCharacters, getActiveEnemies, getObjects, getWalkable } from '../store/getters/map';
import { harmCharacter, setCharacter, removeObject } from "../store/ducks/map";
import { getObjectData } from '../store/getters/gameData';
import { handleTriggers } from '../Triggers/triggerHandler';

const scripts = {};

export const processScript = (code, name) => {
	const imports = [
		"userChooseLocation", "STRAIGHT_LINES", "getSelf", "Action", "hasActionPointsFor",
		"getObjectsWithinRange", "ObjectType", "getClosestObjectWithinRange", "moveTowards",
		"attackTarget", "isSpaceWalkable", "getObjectAtCoords", "sleep",
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
	const characters =  getLivingCharacters(store.getState());
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

const getDataSetWithType = (type) => {
	let dataSet = [];
	let contextFn = null;

	if (type === ObjectType.CHARACTERS) {
		dataSet = getLivingCharacters(store.getState());
		contextFn = getContextFromCharacter;
	} else if (type === ObjectType.DESTROYABLE_OBJECTS) {
		const objects = getObjects(store.getState());
		const objectData = getObjectData(store.getState());

		dataSet = objects.filter(({ type }) => {
			const data = objectData[type] || {};

			return !!data.destroyable;
		});
		contextFn = getContextFromObject;
	} else if (type === ObjectType.OBJECTS) {
		dataSet = getObjects(store.getState());
		contextFn = getContextFromObject;
	} else if (type === ObjectType.ENEMIES) {
		dataSet = getActiveEnemies(store.getState());
		contextFn = getContextFromEnemy;
	}

	return { dataSet, contextFn };
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
			if (type === Action.MOVE) {
				return context.actionPoints >= POINTS_FOR_MOVE;
			} else if (type === Action.ATTACK) {
				return context.actionPoints >= POINTS_FOR_ATTACK;
			}

			return false;
		},
		getObjectsWithinRange: (type, subType, distance) => {
			const { dataSet, contextFn } = getDataSetWithType(type); 

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
			const { dataSet, contextFn } = getDataSetWithType(type);

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
			
			// handle any triggers
			await handleTriggers();
		},
		attackTarget: async (otherContext) => {
			if (context.actionPoints < POINTS_FOR_ATTACK) {
				return;
			}
			context.actionPoints -= POINTS_FOR_ATTACK;

			otherContext.damage(5);

			await sleep(250);
		},
		isSpaceWalkable: (x, y) => {
			const walkable = getWalkable(store.getState());
			const key = `${x}_${y}`;
			return walkable.includes(key);
		},
		getObjectAtCoords: (x, y, type, subType) => {
			const { dataSet, contextFn } = getDataSetWithType(type);

			const key = `${x}_${y}`;

			for (const obj of dataSet) {
				const otherContext = contextFn(obj);
				const otherKey = `${obj.x}_${obj.y}`;

				if (key === otherKey) {
					return otherContext;
				}
			}

			return null;
		},
		sleep: (ms) => {
			return new Promise((resolve) => {
				setTimeout(resolve, ms);
			});
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
		moveTo: async (x, y) => {
			store.dispatch(setCharacter({
				x,
				y,
			}, activeCharIndex));
			
			// handle any triggers
			await handleTriggers();
		},
		damage: (amount) => {
			store.dispatch(harmCharacter(findIdent, amount));
		},
	};
}

const getContextFromObject = (object) => {
	const objectData = getObjectData(store.getState());
	const data = objectData[object.type] || {};

	return {
		x: object.x,
		y: object.y,
		damage: () => {
			if (data.destroyable) {
				store.dispatch(removeObject(object.id));
			}
		}
	}
}

const getContextFromEnemy = (object) => {
	return {
		x: object.x,
		y: object.y,
	}
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
	console.log("executing script as character", charIdent, name);
	const activeChar = characters[activeCharIndex];
	return executeScript(name, getContextFromCharacter(activeChar));
}