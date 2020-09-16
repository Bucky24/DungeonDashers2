import store from '../store';

import { getTriggers } from '../store/getters/map';
import * as conditions from './conditions';
import * as effectData from './effects';

const handleCondition = (condition, state) => {
	if (!conditions[condition.type]) {
		throw new Error(`Unable to find condition with name ${condition}`);
	}
	
	return conditions[condition.type](condition.data, state);
}

const handleEffects = (effects) => {
	handleEffectHelper(effects, 0);
}

const handleEffectHelper = async (effects, count) => {
	if (count >= effects.length) {
		return;
	}

	const effect = effects[count];

	if (!effectData[effect.type]) {
		throw new Error(`Unable to find effect with name ${effect.type}`);
	}

	await effectData[effect.type](effect.data);
	handleEffectHelper(effects, count+1);
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
			handleEffects(trigger.effects);
		}
	});
}