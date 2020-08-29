import React from 'react';

import {
	getBaseEnemyList,
	getBaseObjectList,
	getBaseCharacterList
} from 'system';

import Editor from './Editor'
import TabBar from '../common/TabBar';
import MainTab from './MainTab';

class ScenarioEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			enemyData: {},
			objectData: {},
            characterData: {},
        };
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
        const { width, height } = this.props;

        const mapTab = <Editor
			enemyData={this.state.enemyData}
			objectData={this.state.objectData}
			characterData={this.state.characterData}
		/>;
		
		const mainTab = <MainTab />;

        return <div>
            <a href="#" onClick={() => {
                this.props.setTool(null);
            }}>Go Back</a>
				<TabBar
					tabs={[
						{ id: 'main', name: 'Scenario Main', elem: mainTab },
						{ id: 'map', name: 'Map', elem: mapTab },
					]}
					selectedTab='main'
				/>
        </div>;
    }
}

export default ScenarioEditor;
