import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas } from '@bucky24/react-canvas';
import { saveFile, Types, loadFile, getBaseEnemyList } from 'system';
import Editor from '../Editor'
import TabBar from '../../common/TabBar';
import MainTab from '../MainTab';

import Styles from './style.css';

class App extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			enemyData: {}
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
		this.setState({
			enemyData: enemyDataMap
		});
	}

	render() {
		const { width, height, pane } = this.props;
		
		const mapTab = <Editor
			width={width}
			height={height-100}
			enemyData={this.state.enemyData}
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
