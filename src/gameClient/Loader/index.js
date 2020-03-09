import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Shape, Text, Canvas } from '@bucky24/react-canvas';
import {
	getBaseEnemyList,
	getBaseObjectList,
	getBaseCharacterList,
	getBaseEquipmentList,
} from 'system';

import { Panes, setUIPane } from '../store/ducks/ui';
import {
	setBaseEnemies,
	setBaseObjects,
	setBaseCharacters,
	setBaseEquipment,
} from '../store/ducks/gameData';

class Loader extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			currentStep: 0
		};
	
		this.runStep = this.runStep.bind(this);
		this.loadBaseEnemy = this.loadBaseEnemy.bind(this);
		this.loadBaseObjects = this.loadBaseObjects.bind(this);
		this.loadBaseCharacters = this.loadBaseCharacters.bind(this);
		this.loadBaseEquipment = this.loadBaseEquipment.bind(this);

		this.toLoad = [
			{ name: 'Base Enemy Config', fn: this.loadBaseEnemy },
			{ name: 'Base Object Config', fn: this.loadBaseObjects },
			{ name: 'Base Character Config', fn: this.loadBaseCharacters },
			{ name: 'Base Equipment Config', fn: this.loadBaseEquipment },
		];
	}
	
	runStep() {
		if (this.state.currentStep >= this.toLoad.length) {
			this.props.setPane(Panes.HOME);
			return;
		}
		
		const stepData = this.toLoad[this.state.currentStep];
		stepData.fn().then(() => {
			// slight delay
			setTimeout(() => {
				this.setState({
					currentStep: this.state.currentStep + 1
				}, this.runStep);
			}, 100);
		});
	}
	
	loadBaseEnemy() {
		return Promise.resolve()
		.then(() => {
			return getBaseEnemyList();
		})
		.then((enemyTypes) => {
			this.props.setBaseEnemies(enemyTypes);
		});
	}
	
	loadBaseObjects() {
		return Promise.resolve()
		.then(() => {
			return getBaseObjectList();
		})
		.then((objectTypes) => {
			this.props.setBaseObjects(objectTypes);
		});
	}
	
	loadBaseCharacters() {
		return Promise.resolve()
		.then(() => {
			return getBaseCharacterList();
		})
		.then((characters) => {
			this.props.setBaseCharacters(characters);
		});
	}
	
	loadBaseEquipment() {
		return Promise.resolve()
		.then(() => {
			return getBaseEquipmentList();
		})
		.then((equipment) => {
			this.props.setBaseEquipment(equipment);
		});
	}

	componentDidMount() {
		this.runStep();
	}

	render() {
		const { width, height, setPane } = this.props;
		
		const activeStep = this.toLoad[this.state.currentStep];
		const name = activeStep ? activeStep.name : 'None';
		return (<Canvas
			width={width}
			height={height}
		>
			<Shape
				x={0}
				y={0}
				points={[
					{ x: 0, y: 0 },
					{ x: width, y: 0 },
					{ x: width, y: height },
					{ x: 0, y: height }
				]}
				color="#fff"
				fill={true}
			/>
			<Text x={0} y={12}>
				Loading { name }
			</Text>
		</Canvas>);
	}
}

const mapStateToProps = (state) => {
	return {
		
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setPane: (pane) => {
			dispatch(setUIPane(pane));
		},
		setBaseEnemies: (enemyData) => {
			dispatch(setBaseEnemies(enemyData));
		},
		setBaseObjects: (data) => {
			dispatch(setBaseObjects(data));
		},
		setBaseCharacters: (data) => {
			dispatch(setBaseCharacters(data));
		},
		setBaseEquipment: (data) => {
			dispatch(setBaseEquipment(data));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
