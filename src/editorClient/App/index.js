import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas, Shape } from '@bucky24/react-canvas';
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
			activeTool: null
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
					tiles={[]}
					enemies={[]}
					objects={[]}
					characters={[]}
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
