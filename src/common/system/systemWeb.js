// this file contains mostly stubs, as a lot of these functions
// are not possible via web.

export * from './systemCommon';

export const saveFile = (type, path, data) => {
	console.log('stub method saveFile saving', type, path, data);
	return Promise.resolve('stub');
}