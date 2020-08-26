import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Container,
	ButtonTypes,
	Canvas
} from '@bucky24/react-canvas';
import { Map } from '@bucky24/react-canvas-map';

import { setMap } from '../store/ducks/game';
import { getMap } from '../store/getters/game';

import ToolBar from '../ToolBar';
import BottomBar from '../BottomBar';

import tileMap from '../../common/tileMap';

const ACTIVE_VERSION = 1;
const START_CELL_SIZE = 32;

const TOOL_LIST = [
	{ id: 'select', name: 'Select' },
	{ id: 'terrain', name: 'Terrain' },
	{ id: 'object', name: 'Object' },
	{ id: 'enemy', name: 'Enemy' },
	{ id: 'character', name: 'Character' }
];

const terrainData = {
	'ground1': 'Ground 1',
	'terrain1': 'Terrain 1',
	'terrain2': 'Terrain 2',
	'terrain3': 'Terrain 3',
	'terrain4': 'Terrain 4',
	'terrain5': 'Terrain 5',
	'terrain6': 'Terrain 6',
	'terrain7': 'Terrain 7',
	'terrain8': 'Terrain 8',
	'terrain9': 'Terrain 9',
};

class Editor extends React.Component {
	constructor(props) {
		super(props);

		const data = props.map;
		
		const characterData = {
			"character1": {},
			"character2": {}
		};
		
		const defaultCharacters = [{ ident: 'character1', x: 0, y: 2 }];

		this.state = {
			activeTool: null,
			activeID: null,
			tiles: [],
			fileName: '',
			tiles: data.tiles || [],
			enemies: data.enemies || [],
			objects: data.objects || [],
			characters: data.characters || defaultCharacters,
			width: data.width,
			height: data.height
		};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(x, y, button, cb) {
		if (this.state.activeID === null) {
			return;
		}
		const locateObjectAt = (array, x, y) => {
			return array.findIndex((elem) => {
				return elem.x === x && elem.y === y;
			});
		}
		if (this.state.activeTool === 'terrain') {
			const newTiles = [...this.state.tiles];
			const tileIndex = locateObjectAt(this.state.tiles, x, y);
			if (button === ButtonTypes.LEFT) {
				const tile = {
					tile: this.state.activeID,
					x,
					y
				}
				if (tileIndex === -1) {
					newTiles.push(tile);
				} else {
					newTiles[tileIndex] = tile;
				}
			} else if (button === ButtonTypes.RIGHT) {
				if (tileIndex !== -1) {
					newTiles.splice(tileIndex ,1);
				}
			}
			
			this.setState({
				tiles: newTiles
			}, cb);
		} else if (this.state.activeTool === 'character') {
			const newCharacters = [];
			let foundIndex = locateObjectAt(this.state.characters, x, y);
			let identIndex = -1;
			// cheap copy, could be done better but eh
			this.state.characters.forEach((character, index) => {
				newCharacters.push({ ...character });
				if (character.ident === this.state.activeID) {
					identIndex = index;
				}
			});
			if (button === ButtonTypes.LEFT) {
				if (identIndex >= 0) {
					// updating existing character
					newCharacters[identIndex].x = x;
					newCharacters[identIndex].y = y;
				} else {
					// add new character
					newCharacters.push({
						ident: this.state.activeID,
						x,
						y
					});
				}
			} else if (button === ButtonTypes.RIGHT) {
				if (foundIndex >= 0) {
					// remove the character from the map
					newCharacters.splice(foundIndex, 1);
				}
			}
			// for now just set coords of first character
			this.setState({
				characters: newCharacters
			}, cb);
		} else if (this.state.activeTool === 'enemy') {
			const newEnemies = [...this.state.enemies];
			const objIndex = locateObjectAt(this.state.enemies, x, y);
			if (button === ButtonTypes.LEFT) {
				const enemy = {
					type: this.state.activeID,
					id: newEnemies.length + 1,
					x,
					y
				}
				if (objIndex === -1) {
					newEnemies.push(enemy);
				} else {
					newEnemies[objIndex] = enemy;
				}
			} else if (button === ButtonTypes.RIGHT) {
				if (objIndex !== -1) {
					newEnemies.splice(objIndex ,1);
				}
			}
			
			this.setState({
				enemies: newEnemies
			}, cb);
		} else if (this.state.activeTool === 'object') {
			const newObjects = [...this.state.objects];
			const objIndex = locateObjectAt(this.state.objects, x, y);
			if (button === ButtonTypes.LEFT) {
				const object = {
					type: this.state.activeID,
					id: newObjects.length + 1,
					x,
					y
				}
				if (objIndex === -1) {
					newObjects.push(object);
				} else {
					newObjects[objIndex] = object;
				}
			} else if (button === ButtonTypes.RIGHT) {
				if (objIndex !== -1) {
					newObjects.splice(objIndex ,1);
				}
			}
			
			this.setState({
				objects: newObjects
			}, cb);
		}
	}

	buildMap() {
		return {
			version: ACTIVE_VERSION,
			// sizes stubbed for now
			width: this.state.width,
			height: this.state.height,
			tiles: this.state.tiles,
			objects: this.state.objects,
			characters: this.state.characters,
			enemies: this.state.enemies
		};
	}
	
	updateMap() {
		const map = this.buildMap();
		this.props.setMap(map);
	}

	render() {
		const { width, height, pane } = this.props;
		
		const layers = [];
		const tileImages = this.state.tiles.map((tileObj) => {
			const { tile, x, y } = tileObj;

			return {
				cellX: x,
				cellY: y,
				cellWidth: 1,
				cellHeight: 1,
				src: tileMap[tile],
			};
		});

		layers.push({
			images: tileImages,
		});

		const characterImages = this.state.characters.map((charObj) => {
			const { ident, x, y } = charObj;

			const image = this.props.characterData[ident].imageData;
			const heightInCells = image.height/START_CELL_SIZE;

			return {
				cellX: x,
				cellY: y,
				cellWidth: 1,
				cellHeight: heightInCells,
				src: image.image,
				vAlign: "bottom",
			}
		});

		const enemyImages = this.state.enemies.map((enemy) => {
			const data = this.props.enemyData[enemy.type];
			const image = data.imageData;
			const heightInCells = image.height/START_CELL_SIZE;
			return {
				cellX: enemy.x,
				cellY: enemy.y,
				cellWidth: 1,
				cellHeight: heightInCells,
				src: image.image,
				vAlign: "bottom",
			};
		});

		const objectImages = this.state.objects.map((obj) => {
			const data = this.props.objectData[obj.type];
			const image = data.imageData;
			const heightInCells = image.height/START_CELL_SIZE;
			return {
				cellX: obj.x,
				cellY: obj.y,
				cellWidth: 1,
				cellHeight: heightInCells,
				src: image.image,
				vAlign: "bottom",
			};
		});

		layers.push({
			images: [
				...objectImages,
				...enemyImages,
				...characterImages,
			],
		});

		return <div>
			<Canvas
				width={width}
				height={height-100}
				onClick={this.handleClick}
			>
				<Container>
					<ToolBar
						width={100}
						height={height}
						activeTool={this.state.activeTool}
						tools={TOOL_LIST}
						setActiveTool={(newTool) => {
							this.setState({
								activeTool: newTool,
								activeID: null
							});
						}}
					/>
					<BottomBar
						x={100}
						y={height-100}
						width={width-100}
						height={100}
						activeTool={this.state.activeTool}
					/>
					<Map
						x={100}
						y={0}
						width={width-100}
						height={height-100}
						onClick={(x, y, button) => {
							this.handleClick(x, y, button, () => {
								this.updateMap();
							});
						}}
						layers={layers}
						cellSize={START_CELL_SIZE}
					/>
				</Container>
			</Canvas>
			<BottomBar
				activeTool={this.state.activeTool}
				enemyData={this.props.enemyData}
				terrainList={terrainData}
				setActiveID={(activeID) => {
					this.setState({
						activeID
					});
				}}
				objectData={this.props.objectData}
				activeID={this.state.activeID}
				characterData={this.props.characterData}
			/>
		</div>;
	}
}

const mapStateToProps = (state) => {
	return {
		map: getMap(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setMap: (map) => {
			dispatch(setMap(map));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
