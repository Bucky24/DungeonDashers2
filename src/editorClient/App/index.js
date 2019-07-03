import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas, Shape, ButtonTypes, Text } from '@bucky24/react-canvas';
import ToolBar from '../ToolBar';
import BottomBar from '../BottomBar';
import Map from '../../common/Map';
import Button from '../../common/Button';
import { saveFile, Types, loadFile } from 'system';
import TextField from '../../common/TextField'

import './style.css';

const ACTIVE_VERSION = 1;

const TOOL_LIST = [
	{ id: 'select', name: 'Select' },
	{ id: 'terrain', name: 'Terrain' },
	{ id: 'object', name: 'Object' },
	{ id: 'enemy', name: 'Enemy' },
	{ id: 'character', name: 'Character' }
];

class App extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			activeTool: null,
			tiles: [],
			fileName: '',
			characters: [{ x: 0, y: 2 }],
			objects: [],
			enemies: [],
			width: 40,
			height: 40
		};
		
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(x, y, button) {
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
					tile: 'ground1',
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
			});
		} else if (this.state.activeTool === 'character') {
			// for now just set coords of first character
			this.setState({
				characters: [{ x, y }]
			});
		} else if (this.state.activeTool === 'enemy') {
			const newEnemies = [...this.state.enemies];
			const objIndex = locateObjectAt(this.state.enemies, x, y);
			if (button === ButtonTypes.LEFT) {
				const enemy = {
					type: "bat",
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
			});
		} else if (this.state.activeTool === 'object') {
			const newObjects = [...this.state.objects];
			const objIndex = locateObjectAt(this.state.objects, x, y);
			if (button === ButtonTypes.LEFT) {
				const object = {
					type: "door",
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
			});
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

	render() {
		const { width, height, pane } = this.props;

		return <div className="App">
			<Canvas 
				width={width}
				height={height}
			>
				<ToolBar
					width={100}
					height={height}
					activeTool={this.state.activeTool}
					tools={TOOL_LIST}
					setActiveTool={(newTool) => {
						this.setState({
							activeTool: newTool
						});
					}}
				/>
				<Button
					x={0}
					y={height-50}
					width={100}
					height={50}
					text="Save"
					onClick={() => {
						const file = this.state.fileName
						if (!file || file === '') {
							alert('Unable to save file, no filename given');
							return;
						}
						const fullName = `${file}.map`;
						const mapData = this.buildMap();
						saveFile(Types.MAP_CUSTOM, fullName, mapData).then((data) => {
							alert(`File saved to ${data}`);
						});
					}}
				/>
				<Button
					x={0}
					y={height-100}
					width={100}
					height={50}
					text="Load"
					onClick={() => {
						const file = this.state.fileName
						if (!file || file === '') {
							alert('Unable to load file, no filename given');
							return;
						}
						loadFile(Types.MAP_CUSTOM, file).then((data) => {
							this.setState({
								tiles: data.tiles || [],
								enemies: data.enemies || [],
								objects: data.objects || [],
								characters: data.characters || [],
								width: data.width,
								height: data.height
							})
							console.log('data is', data);
						}).catch((error) => {
							alert(error);
						})
					}}
				/>
				<BottomBar
					x={100}
					y={height-100}
					width={width-100}
					height={100}
					activeTool={this.state.activeTool}
				/>
				<Text
					x={100}
					y={height-86}
				>
					Filename:
				</Text>
				<TextField
					x={150}
					y={height-100}
					width={300}
					height={20}
					onChange={(newText) => {
						this.setState({
							fileName: newText
						});
					}}
				/>
				<Map
					x={100}
					y={0}
					width={width-100}
					height={height-100}
					tiles={this.state.tiles}
					enemies={this.state.enemies}
					objects={this.state.objects}
					characters={this.state.characters}
					onClick={(x, y, button) => {
						this.handleClick(x, y, button);
					}}
				/>
			</Canvas>
		</div>;
	}
}

const mapStateToProps = (state) => {
	return {

	};
};

const mapDispatchToProps = (dispatch) => {
	return {
	
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
