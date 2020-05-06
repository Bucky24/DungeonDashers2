import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Text, Canvas } from '@bucky24/react-canvas';

import Button from '../../common/Button';

import { getActiveCampaign } from '../store/getters/campaign';
import { Panes, setUIPane } from '../store/ducks/ui';

class WonGame extends Component {
	constructor(props) {
		super(props);
		
		this.state = {};
	}

	render() {
		const { width, height, setPane, activeCampaign } = this.props;

		return (<Canvas
			width={width}
			height={height}
		>
			<Text
				x={200}
				y={200}
			>You win!</Text>
			{ activeCampaign && <Button
				x={200}
				y={250}
				width={200}
				height={50}
				text="Continue Campaign"
				onClick={() => {
					setPane(Panes.CAMPAIGN);
				}}
			/> }
			{ !activeCampaign && <Button
				x={200}
				y={250}
				width={200}
				height={50}
				text="Continue"
				onClick={() => {
					setPane(Panes.SAVE_LOAD);
				}}
			/> }
		</Canvas>);
	}
}

const mapStateToProps = (state) => {
	return {
		activeCampaign: getActiveCampaign(state),
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setPane: (pane) => {
			dispatch(setUIPane(pane));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(WonGame);