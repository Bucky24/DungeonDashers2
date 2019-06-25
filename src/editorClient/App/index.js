import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas, Shape, ButtonTypes } from '@bucky24/react-canvas';
import ToolBar from '../ToolBar';
import BottomBar from '../BottomBar';
import Map from '../../common/Map';

import './style.css';

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
			tiles: []
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
