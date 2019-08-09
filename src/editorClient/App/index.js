import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas } from '@bucky24/react-canvas';
import {
	saveFile,
	Types,
	loadFile,
	getBaseEnemyList,
	getBaseObjectList
} from 'system';
import Editor from '../Editor'
import TabBar from '../../common/TabBar';
import MainTab from '../MainTab';

import Styles from './style.css';

class App extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			enemyData: {},
			objectData: {}
		}
	}
	
	async componentDidMount() {
		// fetch enemy data
		const enemyData = await getBaseEnemyList();
		const enemyDataMap = enemyData.reduce((obj, enemy) => {
			return {
				...obj,
				[enemy.type]: enemy
			};
		}, {})
		// fetch object data
		const objectData = await getBaseObjectList();
		const objectDataMap = objectData.reduce((obj, object) => {
			return {
				...obj,
				[object.type]: object
			};
		}, {})
		this.setState({
			enemyData: enemyDataMap,
			objectData: objectDataMap
		});
	}

	render() {
		const { width, height, pane } = this.props;
		
		const mapTab = <Editor
			width={width}
			height={height-100}
			enemyData={this.state.enemyData}
			objectData={this.state.objectData}
		/>;
		
		const mainTab = <MainTab />;

		return <div className="App">
			<TabBar
				tabs={[
					{ id: 'main', name: 'Main', elem: mainTab },
					{ id: 'map', name: 'Map', elem: mapTab }
				]}
				selectedTab='main'
			/>
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
