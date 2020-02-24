import { getCharacters, getObjects } from "../store/getters/map";

let variables = {};

export const reset = () => {
	variables = {};
}

const getVariable = (name, state) => {
	if (variables[name]) {
		return variables[name];
	}

	const characters = getCharacters(state);
	const objects = getObjects(state);
	
	switch (name) {
	case "totalCharactersAlive":
		// characters don't have hp right now so we can't even track it
		// so for now just don't deal with it (I'll regret this later)
		return characters.length;
	case "charactersOnPortal":
		const portalObjects = objects.filter((object) => {
			return object.type == "portal";
		});
		
		const portalKeys = portalObjects.map((obj) => {
			return `${obj.x}_${obj.y}`;
		});
		
		const charactersOnPortals = characters.filter((char) => {
			const charKey = `${char.x}_${char.y}`;
			return portalKeys.includes(charKey);
		});
		
		return charactersOnPortals.length;
	default:
		throw new Error(`Unknown variable name ${name}`);
	}
}

export const variableCheck = (data, state) => {
	const var1Name = data.variable;
	const var2Name = data.comparisonVariable;
	
	const var1 = getVariable(var1Name, state);
	const var2 = getVariable(var2Name, state);
	
	switch (data.operator) {
	case "==":
		return var1 === var2;
	default:
		throw new Error(`Unknown operator ${data.operator}`);
	}
}
