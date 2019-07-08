import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Text, Canvas } from '@bucky24/react-canvas';
import Button from '../../common/Button';
import { getFileList, loadFile, Types } from 'system';

import { Panes, setUIPane } from '../store/ducks/ui';
import { setMap } from '../store/ducks/map';
import { getEnemyData } from '../store/getters/gameData';

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

class MapSelect extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			maps: [],
			customMaps: []
		};
	}
	
	loadMap(type, mapName) {
		loadFile(type, mapName).then((data) => {
			// process the data
			const enemyBaseStats = this.props.enemyData;
			const newObjects = data.objects.map((object) => {
				return {
					...object,
					key: `${object.x}_${object.y}`
				};
			});
			// any enemy without a trigger is active immediately
			const inactiveEnemies = [];
			const activeEnemies = [];
			data.enemies.forEach((enemy) => {
				const newEnemy = {
					...enemy
				};
				newEnemy.hp = enemyBaseStats[enemy.type].maxHP;
				if (enemy.trigger) {
					inactiveEnemies.push(newEnemy);
				} else {
					activeEnemies.push(newEnemy);
				}
			});
		
			const newMap = {
				tiles: data.tiles,
				characters: data.characters,
				objects: newObjects,
				width: data.width,
				height: data.height,
				walkable: getWalkable(data.tiles, newObjects),
				inactiveEnemies,
				activeEnemies
			};
			this.props.setMap(newMap);
			this.props.setPane(Panes.GAME);
		});
	}

	componentDidMount() {
		getFileList(Types.MAP).then((files) => {
			this.setState({
				maps: files
			});
		});
		getFileList(Types.MAP_CUSTOM).then((files) => {
			this.setState({
				customMaps: files
			});
		});
	}

	render() {
		const { width, height, setPane } = this.props;
		return (<Canvas
			width={width}
			height={height}
		>
			<Button
				x={0}
				y={height-50}
				width={200}
				height={50}
				text="Main Menu"
				onClick={() => {
					setPane(Panes.HOME);
				}}
			/>
			<Text x={0} y={12}>
				Base Maps
			</Text>
			{ this.state.maps.map((mapName, index) => {
				return <Button
					key={`base_${index}`}
					x={0}
					y={50*index + 20}
					width={200}
					height={50}
					text={mapName}
					onClick={() => {
						this.loadMap(Types.MAP, mapName);
					}}
				/>;
			})}
			<Text x={200} y={12}>
				Custom Maps
			</Text>
			{ this.state.customMaps.map((mapName, index) => {
				return <Button
					key={`custom_${index}`}
					x={200}
					y={50*index + 20}
					width={200}
					height={50}
					text={mapName}
					onClick={() => {
						this.loadMap(Types.MAP_CUSTOM, mapName);
					}}
				/>;
			})}
		</Canvas>);
	}
}

const mapStateToProps = (state) => {
	return {
		enemyData: getEnemyData(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setPane: (pane) => {
			dispatch(setUIPane(pane));
		},
		setMap: (gameData) => {
			dispatch(setMap(gameData));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MapSelect);