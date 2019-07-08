import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas } from '@bucky24/react-canvas';
import { saveFile, Types, loadFile, getBaseEnemyList } from 'system';
import Editor from '../Editor'

import './style.css';

class App extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			enemyData: {}
		}
	}
	
	componentDidMount() {
		// fetch enemy data
		return Promise.resolve()
		.then(() => {
			return getBaseEnemyList();
		})
		.then((enemyData) => {
			// turn into a map
			const enemyDataMap = enemyData.reduce((obj, enemy) => {
				return {
					...obj,
					[enemy.type]: enemy
				};
			}, {})
			this.setState({
				enemyData: enemyDataMap
			});
		});
	}

	render() {
		const { width, height, pane } = this.props;

		return <div className="App">
			<Canvas 
				width={width}
				height={height}
			>
				<Editor
					width={width}
					height={height}
					enemyData={this.state.enemyData}
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
