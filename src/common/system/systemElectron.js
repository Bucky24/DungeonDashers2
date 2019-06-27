// this file contains the actual electron hooks to fetch file
// data and save files and etc

import { Types } from './systemCommon';
export * from './systemCommon';
import { request } from './electronComs';

export const saveFile = (type, path, data) => {
	return new Promise((resolve, reject) => {
		request('saveFile', { type, path, data }, (success, result, error) => {
			if (!success) {
				reject(error);
			}
			
			resolve(result);
		});
	});
}

export const loadFile = (type, path) => {
	return new Promise((resolve, reject) => {
		console.log('Attempting to load file of type', type, 'at', path);
		request('loadFile', { type, path }, (success, result, error) => {
			if (!success) {
				reject(error);
			}
			
			resolve(result);
		});
	});
}

export const getFileList = (type) => {
	return new Promise((resolve, reject) => {
		console.log('Attempting to load file list type', type);
		request('getFileList', { type }, (success, result, error) => {
			if (!success) {
				reject(error);
			}
			
			resolve(result);
		});
	});
}