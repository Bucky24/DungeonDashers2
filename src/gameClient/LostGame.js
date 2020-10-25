import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, Canvas } from '@bucky24/react-canvas';

import Button from '../common/Button';

import { Panes, setUIPane } from './store/ducks/ui';

class LostGame extends Component {
	constructor(props) {
		super(props);
		
		this.state = {};
	}

	render() {
		const { width, height, setPane } = this.props;

		return (<Canvas
			width={width}
			height={height}
		>
			<Text
				x={200}
				y={200}
			>You Lost!</Text>
			<Button
				x={200}
				y={250}
				width={200}
				height={50}
				text="Back to Menu"
				onClick={() => {
					setPane(Panes.SAVE_LOAD);
				}}
			/>
		</Canvas>);
	}
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setPane: (pane) => {
			dispatch(setUIPane(pane));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LostGame);