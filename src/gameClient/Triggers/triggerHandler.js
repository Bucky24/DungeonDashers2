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

	const state = store.getState()
	await effectData[effect.type](effect.data, state);
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

		let triggered = false;
		if (trueConditions > 0 && trigger.conditionMode === "any") {
			triggered = true;
		}
		if (trueConditions === trigger.conditions.length) {
			triggered = true;
		}
		if (triggered) {
			// it's been triggered. Run the effects
			handleEffects(trigger.effects);
		}
	});
}