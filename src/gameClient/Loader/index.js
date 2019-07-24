import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Shape, Text, Canvas } from '@bucky24/react-canvas';
import {
	getBaseEnemyList
} from 'system';

import { Panes, setUIPane } from '../store/ducks/ui';
import { setBaseEnemies } from '../store/ducks/gameData';

class Loader extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			currentStep: 0
		};
	
		this.runStep = this.runStep.bind(this);
		this.loadBaseEnemy = this.loadBaseEnemy.bind(this);
		
		this.toLoad = [
			{ name: 'Base Enemy Config', fn: this.loadBaseEnemy }
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
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
