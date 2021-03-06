// this file contains mostly stubs, as a lot of these functions
// are not possible via web.

import { Types } from './systemCommon';
export * from './systemCommon';

import Sample1 from '../../data/maps/sample1.map';
import Sample2 from '../../data/maps/sample2.map';
import Humble from '../../data/maps/humble_beginnings.map';
import Campaign1 from '../../data/campaigns/campaign1.camp';
import HeroTale from '../../data/campaigns/a_heroes_tale.camp';

import Bat from '../../data/enemies/bat.enemy';
import BatImage from '../../data/enemies/bat.png';
import Skeleton from '../../data/enemies/skeleton.enemy';
import SkeletonImage from '../../data/enemies/skeleton.png';

import Door from '../../data/objects/door.object';
import DoorImage from '../../data/objects/door.png';
import Chest from '../../data/objects/chest.object';
import ChestImage from '../../data/objects/chest.png';
import Portal from '../../data/objects/portal.object';
import PortalImage from '../../data/objects/portal.png';
import RockSpike from '../../data/objects/rock_spike.object';
import RockSpikeImage from '../../data/objects/rock_spike.png';
import Rock from '../../data/objects/rock.object';
import RockImage from '../../data/objects/rock.png';
import Switch from '../../data/objects/switch.object';
import SwitchImage from '../../data/objects/switch_off.png';

import Character1 from '../../data/characters/character1.char';
import Character1Image from '../../data/characters/character1.png';
import Character2 from '../../data/characters/character2.char';
import Character2Image from '../../data/characters/character2.png';

import Sword from '../../data/equipment/sword.equip';

export const saveFile = (type, path, data) => {
	console.log('stub method saveFile saving', type, path, data);
	return Promise.resolve('stub');
}

export const loadFile = (type, path) => {
	if (type === Types.MAP) {
		switch (path) {
		case 'sample1':
			return Promise.resolve(Sample1);
		case 'sample2':
			return Promise.resolve(Sample2);
		case 'humble_beginnings':
			return Promise.resolve(Humble);
		}
	} else if (type === Types.MAP_CUSTOM) {
		return Promise.resolve(Sample1);
	} else if (type === Types.CAMPAIGN_CUSTOM) {
		return Promise.resolve(Campaign1);
	} else if (type === Types.CAMPAIGN) {
		return Promise.resolve(Campaign1);
	} else if (type === Types.SAVED_MAP) {
		return Promise.resolve({
			map: 'sample1',
			custom: false,
			inactiveEnemies: [],
			activeEnemies: [
				{ "type": "bat", "id": 1, "trigger": 1, "x": 8, "y": 10, "hp": 10, "maxHp": 10 }
			],
			objects: [
				{ "type": "door", "id": 1, "x": 8, "y": 6, "isOpen": true },
			],
			characters: [
				{ "x": 5, "y": 6, "ident": "character1" },
				{ "x": 4, "y": 6, "ident": "character2" }
			]
		});
	} else if (type === Types.SAVED_CAMPAIGN) {
		return Promise.resolve({
			version: 1,
			type: 'campaign',
			campaignName: 'campaign1',
			currentMap: 'sample2',
			custom: true,
		})
	}
	
	return Promise.reject(`unknown type: ${type}`);
}

export const getFileList = (type) => {
	if (type === Types.MAP) {
		return Promise.resolve(['sample1', 'sample2', 'humble_beginnings']);
	} else if (type === Types.MAP_CUSTOM) {
		return Promise.resolve(['sample1']);
	} else if (type === Types.CAMPAIGN_CUSTOM) {
		return Promise.resolve(['campaign1']);
	} else if (type === Types.CAMPAIGN) {
		return Promise.resolve(['a_heroes_tale']);
	} else if (type === Types.SAVED_CAMPAIGN) {
		return Promise.resolve(['saved_campaign_sample']);
	} else if (type === Types.SAVED_MAP) {
		return Promise.resolve(['saved_map_sample']);
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
				image: DoorImage,
			},
		},
		{
			...Chest,
			type: 'chest',
			imageData: {
				...Chest.imageData,
				image: ChestImage,
			},
		},
		{
			...Portal,
			type: 'portal',
			imageData: {
				...Portal.imageData,
				image: PortalImage,
			},
		},
		{
			...RockSpike,
			type: 'rock_spike',
			imageData: {
				...RockSpike.imageData,
				image: RockSpikeImage,
			},
		},
		{
			...Rock,
			type: 'rock',
			imageData: {
				...Rock.imageData,
				image: RockImage,
			},
		},
		{
			...Switch,
			type: "switch",
			imageData: {
				...Switch.imageData,
				image: SwitchImage,
			},
		},
	];
}

export const getBaseCharacterList = () => {
	return [
		{
			...Character1,
			imageData: {
				...Character1.imageData,
				image: Character1Image
			}
		},
		{
			...Character2,
			imageData: {
				...Character2.imageData,
				image: Character2Image
			}
		}
	];
}

export const getBaseEquipmentList = () => {
	return [
		{
			...Sword,
		},
	]
}
