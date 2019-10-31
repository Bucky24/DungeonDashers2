import { loadFile } from 'system';
import { Types } from '../system/systemCommon';

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

export const loadExistingMap = async (saveFileName, enemyData, setMap, setActiveCharacter, setMapMeta) => {
	const saveFile = await loadFile(Types.SAVED_MAP, saveFileName);
	
	const mapName = saveFile.map;
	const mapType = saveFile.custom ? Types.MAP_CUSTOM : Types.MAP;
	
	const data = await loadMapBase(mapType, mapName);
	
	data.activeEnemies = saveFile.activeEnemies;
	data.inactiveEnemies = saveFile.inactiveEnemies;
	data.characters = saveFile.characters;
	data.objects = saveFile.objects;
	
	processMapData(data, enemyData, setMap, setActiveCharacter);
	setMapMeta(mapName, mapType);
};

export const loadNewMap = async (type, mapName, enemyData, setMap, setActiveCharacter, setMapMeta) => {
	const data = await loadMapBase(type, mapName);

	const inactiveEnemies = [];
	const activeEnemies = [];
	data.enemies.forEach((enemy) => {
		const newEnemy = Object.assign({}, enemy);

		newEnemy.hp = enemyData[enemy.type].maxHP;
		if (enemy.trigger) {
			inactiveEnemies.push(newEnemy);
		} else {
			activeEnemies.push(newEnemy);
		}
	});

	data.inactiveEnemies = inactiveEnemies;
	data.activeEnemies = activeEnemies;

	processMapData(data, enemyData, setMap, setActiveCharacter);
	setMapMeta(mapName, type === Types.MAP_CUSTOM);
};

const processMapData = (data, enemyData, setMap, setActiveCharacter) => {
	// process the data
	const newObjects = data.objects.map((object) => {
		return {
			...object,
			key: `${object.x}_${object.y}`
		};
	});

	const newMap = {
		tiles: data.tiles,
		characters: data.characters,
		objects: newObjects,
		width: data.width,
		height: data.height,
		walkable: getWalkable(data.tiles, newObjects),
		inactiveEnemies: data.inactiveEnemies,
		activeEnemies: data.activeEnemies
	};
	
	setMap(newMap);
	setActiveCharacter(0);
	
};

const loadMapBase = (type, mapName) => {
	return loadFile(type, mapName);
};

export const loadCampaign = (type, campaignName, newGame, setCampaign) => {
	return loadFile(type, campaignName).then(async (data) => {
		let currentMap = data.maps[0];
		
		setCampaign(campaignName);
		
		if (!newGame) {
			const campaignData = await(loadFile, Types.SAVED_CAMPAIGN, campaignName)
		}
	});
};