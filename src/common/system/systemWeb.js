// this file contains mostly stubs, as a lot of these functions
// are not possible via web.

import { Types } from './systemCommon';
export * from './systemCommon';

import Sample1 from '../../data/maps/sample1.json';

export const saveFile = (type, path, data) => {
	console.log('stub method saveFile saving', type, path, data);
	return Promise.resolve('stub');
}

export const loadFile = (type, path) => {
	if (type === Types.MAP) {
		return Promise.resolve(Sample1);
	}
}