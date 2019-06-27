// this file contains mostly stubs, as a lot of these functions
// are not possible via web.

import { Types } from './systemCommon';
export * from './systemCommon';

import Sample1 from '../../data/maps/sample1.map';

export const saveFile = (type, path, data) => {
	console.log('stub method saveFile saving', type, path, data);
	return Promise.resolve('stub');
}

export const loadFile = (type, path) => {
	if (type === Types.MAP) {
		return Promise.resolve(Sample1);
	}
	
	return Promise.reject('unknown type');
}

export const getFileList = (type) => {
	if (type === Types.MAP) {
		return Promise.resolve(['sample1']);
	} else if (type === Types.MAP_CUSTOM) {
		return Promise.resolve([]);
	}
}
