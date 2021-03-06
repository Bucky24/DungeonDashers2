import { loadFile } from 'system';
import { Types } from '../system/systemCommon';

import mapValidator from '../validation/map';

const WalkableTiles = [
	'ground1'
];

const collidableObjects = [
	
];

const getWalkable = (tiles, objects) => {
	const objectKeys = objects.map((object) => {
		if (collidableObjects.includes(object.type)) {
			return object.key;
		}
	});
	const walkable = tiles.map((tile) => {
		if (WalkableTiles.includes(tile.tile)) {
			return {
				x: tile.x,
				y: tile.y
			};
		}
	}).filter((data) => {
		return !!data
	})
	.map((data) => {
		return `${data.x}_${data.y}`;
	})
	.filter((key) => {
		return !objectKeys.includes(key);
	});
	
	return walkable;
}

export const loadExistingMap = async (saveFileName, enemyData, characterData, setMap, setActiveCharacter, setMapMeta) => {
	const saveFile = await loadFile(Types.SAVED_MAP, saveFileName);
	
	const mapName = saveFile.map;
	const mapType = saveFile.custom ? Types.MAP_CUSTOM : Types.MAP;
	
	const data = await loadMapBase(mapType, mapName);
	
	data.activeEnemies = saveFile.activeEnemies;
	data.inactiveEnemies = saveFile.inactiveEnemies;
	data.characters = saveFile.characters;
	data.objects = saveFile.objects;
	
	processMapData(data, enemyData, characterData, setMap, setActiveCharacter);
	setMapMeta(mapName, mapType);
};

export const loadNewMap = async (type, mapName, enemyData, characterData, setMap, setActiveCharacter, setMapMeta) => {
	const data = await loadMapBase(type, mapName);


	const inactiveEnemies = [];
	const activeEnemies = [];
	data.enemies.forEach((enemy) => {
		const newEnemy = Object.assign({}, enemy);

		newEnemy.hp = enemyData[enemy.type].maxHP;
		if (enemy.doorTrigger) {
			inactiveEnemies.push(newEnemy);
		} else {
			activeEnemies.push(newEnemy);
		}
	});

	data.inactiveEnemies = inactiveEnemies;
	data.activeEnemies = activeEnemies;

	processMapData(data, enemyData, characterData, setMap, setActiveCharacter);
	setMapMeta(mapName, type === Types.MAP_CUSTOM);
};

const processMapData = (data, enemyData, characterData, setMap, setActiveCharacter) => {
	// process the data
	const newObjects = data.objects.map((object) => {
		return {
			...object,
			key: `${object.x}_${object.y}`
		};
	});

	const newCharacters = data.characters.map((character) => {
		const data = characterData[character.ident];
		return {
			...character,
			actionPoints: character.actionPoints || data.actionPoints,
			equipment: character.equipment || [],
			hp: character.hp || data.maxHP,
			maxHP: data.maxHP,
		};
	});

	const newActiveEnemies = data.activeEnemies.map((enemy) => {
		const data = enemyData[enemy.type];
		return {
			...enemy,
			actionPoints: enemy.actionPoints || data.actionPoints,
			hp: enemy.hp || data.maxHP,
			maxHP: data.maxHP,
		};
	});

	// when we activate, we don't have access to the enemy data, because
	// I put it in the duck for some reason. So just do it here.
	const newInactiveEnemies = data.inactiveEnemies.map((enemy) => {
		const data = enemyData[enemy.type];
		return {
			...enemy,
			actionPoints: enemy.actionPoints || data.actionPoints,
			hp: enemy.hp || data.maxHP,
			maxHP: data.maxHP,
		};
	});

	const newMap = {
		tiles: data.tiles,
		characters: newCharacters,
		objects: newObjects,
		width: data.width,
		height: data.height,
		walkable: getWalkable(data.tiles, newObjects),
		inactiveEnemies: newInactiveEnemies,
		activeEnemies: newActiveEnemies,
		triggers: data.triggers,
	};
	
	setMap(newMap);
	setActiveCharacter(0);
	
};

const loadMapBase = async (type, mapName) => {
	const mapData = await loadFile(type, mapName);

	return mapValidator(mapData);
};

export const loadSavedCampaign = (
	campaignName, setCampaign, setCampaignMaps, setCurrentMap, setIsCustom,
) => {
	return loadFile(Types.SAVED_CAMPAIGN, campaignName).then(async (campaignData) => {
		const type = campaignData.custom ? Types.CAMPAIGN_CUSTOM : Types.CAMPAIGN;

		setIsCustom(campaignData.custom);
		
		const data = await loadFile(type, campaignData.campaignName);
		setCampaign(campaignName);
		setCampaignMaps(data.maps);
		
		setCurrentMap(campaignData.currentMap);
	});
};

export const loadNewCampaign = (
	type, campaignName, setCampaign, setCampaignMaps, setCurrentMap, setIsCustom,
) => {
	return loadFile(type, campaignName).then((data) => {
		setCampaign(campaignName);
		setCampaignMaps(data.maps);
		setIsCustom(type === Types.CAMPAIGN_CUSTOM);
		
		if (data.maps.length > 0) {
			setCurrentMap(data.maps[0]);
		}
	});
};