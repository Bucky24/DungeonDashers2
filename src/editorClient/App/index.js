import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas } from '@bucky24/react-canvas';
import {
	saveFile,
	Types,
	loadFile,
	getBaseEnemyList,
	getBaseObjectList,
	getBaseCharacterList
} from 'system';
import Editor from '../Editor'
import TabBar from '../../common/TabBar';
import MainTab from '../MainTab';
import Campaign from '../Campaign';

import MainMenu from '../MainMenu/MainMenu';

import Styles from './style.css';

class App extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			enemyData: {},
			objectData: {},
			characterData: {}
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
		}, {});
		// fetch object data
		const objectData = await getBaseObjectList();
		const objectDataMap = objectData.reduce((obj, object) => {
			return {
				...obj,
				[object.type]: object
			};
		}, {});
		// fetch character data
		const characterData = await getBaseCharacterList();
		const characterDataMap = characterData.reduce((obj, character) => {
			return {
				...obj,
				[character.ident]: character
			};
		}, {});
		this.setState({
			enemyData: enemyDataMap,
			objectData: objectDataMap,
			characterData: characterDataMap
		});
	}

	render() {
		const { width, height, pane } = this.props;
		
		const mapTab = <Editor
			width={width}
			height={height-100}
			enemyData={this.state.enemyData}
			objectData={this.state.objectData}
			characterData={this.state.characterData}
		/>;
		
		const mainTab = <MainTab />;
		const campaignTab = <Campaign />;

		return <div className="App">
			<MainMenu />
			{ false && <TabBar
				tabs={[
					{ id: 'main', name: 'Scenario Main', elem: mainTab },
					{ id: 'map', name: 'Map', elem: mapTab },
					{ id: 'campaign', name: 'Campaign', elem: campaignTab }
				]}
				selectedTab='main'
			/> }
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
