import store from "../store";

import { STRAIGHT_LINES } from './constants';
import { onOnce } from "../eventEmitter/emitter";

import { setChooseLoc } from '../store/ducks/ui';
import { getCharacters } from '../store/getters/map';
import { setCharacter } from "../store/ducks/map";

const scripts = {};

export const processScript = (code, name) => {
	const imports = ["userChooseLocation", "STRAIGHT_LINES", "getSelf"];
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
			return context.object;
		},
		STRAIGHT_LINES,
	};
}

export const executeScript = (name, context) => {
	if (!scripts[name]) {
		throw new Error(`Cannot find script with name ${name}`);
	}
	
	const fn = scripts[name];
	const globalContext = getGlobalContext(context);
	
	try {
		fn(globalContext);
	} catch (error) {
		throw new Error(`Error executing script ${name}: ${error.message}`);
	}
}

export const executeScriptAsCharacter = (name, charIdent) => {
	const characters = getCharacters(store.getState());
	const activeCharIndex = characters.findIndex(({ ident }) => {
		return ident === charIdent;
	});
	const activeChar = characters[activeCharIndex];
	return executeScript(name, {
		x: activeChar.x,
		y: activeChar.y,
		object: {
			moveTo: (x, y) => {
				store.dispatch(setCharacter({
					x,
					y,
				}, activeCharIndex));
			},
		},
	});
}