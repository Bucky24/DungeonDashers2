import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Text, Canvas, Rect } from '@bucky24/react-canvas';
import Button from '../../common/Button';

import { Panes, setUIPane } from '../store/ducks/ui';

class SaveLoadSelect extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			maps: [],
			customMaps: [],
			campaigns: [],
			customCampaigns: [],
			tab: 'campaigns'
		};
	}

	render() {
		const { width, height, setPane } = this.props;
		return (<Canvas
			width={width}
			height={height}
		>
			<Rect
				x={0}
				y={0}
				x2={width}
				y2={height}
				color="#fff"
				fill={true}
			/>
			<Text
				x={0}
				y={12}
			>Single Player</Text>
			<Button
				x={0}
				y={20}
				width={200}
				height={50}
				text="New Game"
				onClick={() => {
					setPane(Panes.NEW_MAP_SELECT);
				}}
			/>
			<Button
				x={0}
				y={70}
				width={200}
				height={50}
				text="Load Game"
				onClick={() => {
					setPane(Panes.LOAD_GAME_SELECT);
				}}
			/>
			<Button
				x={0}
				y={height-50}
				width={200}
				height={50}
				text="Main Menu"
				onClick={() => {
					setPane(Panes.HOME);
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
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SaveLoadSelect);