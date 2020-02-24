import store from '../store';

import { getTriggers } from '../store/getters/map';
import * as conditions from './conditions';
import * as effects from './effects';

const handleCondition = (condition, state) => {
	if (!conditions[condition.type]) {
		throw new Error(`Unable to find condition with name ${condition}`);
	}
	
	return conditions[condition.type](condition.data, state);
}

const handleEffect = async (effect) => {
	if (!effects[effect.type]) {
		throw new Error(`Unable to find effect with name ${effect}`);
	}
	
	await effects[effect.type](effect.data);
}

export const handleTriggers = function() {
	// start by resetting the conditions system cache just in case
	conditions.reset();

	const state = store.getState()
	const triggers = getTriggers(state);
	
	triggers.forEach((trigger) => {
		// process each condition to see if it's true
		let trueConditions = 0;
		trigger.conditions.forEach((condition) => {
			const result = handleCondition(condition, state);
			if (result === true) {
				trueConditions ++;
			}
		});
		
		if (trueConditions === trigger.conditions.length) {
			// it's been triggered. Run the effects
			trigger.effects.forEach((effect) => {
				handleEffect(effect);
			});
		}
	});
}