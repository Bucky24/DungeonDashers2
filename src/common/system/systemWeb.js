// this file contains mostly stubs, as a lot of these functions
// are not possible via web.

import { Types } from './systemCommon';
export * from './systemCommon';

import Sample1 from '../../data/maps/sample1.map';

import Bat from '../../data/enemies/bat.enemy';
import BatImage from '../../data/enemies/bat.png';
import Skeleton from '../../data/enemies/skeleton.enemy';
import SkeletonImage from '../../data/enemies/skeleton.png';
import Door from '../../data/objects/door.object';
import DoorImage from '../../data/objects/door.png';
import Chest from '../../data/objects/chest.object';
import ChestImage from '../../data/objects/chest.png';

export const saveFile = (type, path, data) => {
	console.log('stub method saveFile saving', type, path, data);
	return Promise.resolve('stub');
}

export const loadFile = (type, path) => {
	if (type === Types.MAP) {
		return Promise.resolve(Sample1);
	} else if (type === Types.MAP_CUSTOM) {
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

export const getBaseEnemyList = () => {
	return [
		{
			...Bat,
			type: 'bat',
			imageData: {
				...Bat.imageData,
				image: BatImage
			}
		},
		{
			...Skeleton,
			type: 'skeleton',
			imageData: {
				...Skeleton.imageData,
				image: SkeletonImage
			}
		}
	];
}

export const getBaseObjectList = () => {
	return [
		{
			...Door,
			type: 'door',
			imageData: {
				...Door.imageData,
				image: DoorImage
			}
		},
		{
			...Chest,
			type: 'chest',
			imageData: {
				...Chest.imageData,
				image: ChestImage
			}
		}
	];
}
