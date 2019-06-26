import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas, Shape, ButtonTypes, Text } from '@bucky24/react-canvas';
import ToolBar from '../ToolBar';
import BottomBar from '../BottomBar';
import Map from '../../common/Map';
import Button from '../../common/Button';
import { saveFile, Types } from 'system';
import TextField from '../../common/TextField'

import './style.css';

const ACTIVE_VERSION = 1;

const TOOL_LIST = [
	{ id: 'select', name: 'Select' },
	{ id: 'terrain', name: 'Terrain' },
	{ id: 'object', name: 'Object' }
];

class App extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			activeTool: null,
			tiles: [],
			fileName: ''
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
		}
	}
	
	buildMap() {
		return {
			version: ACTIVE_VERSION,
			// sizes stubbed for now
			width: 40,
			height: 40,
			tiles: this.state.tiles
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
						saveFile(Types.MAP, fullName, mapData).then((data) => {
							alert(`File saved to ${data}`);
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
					enemies={[]}
					objects={[]}
					characters={[]}
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
