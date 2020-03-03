import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Text, Canvas, Rect } from '@bucky24/react-canvas';
import TitleImage from '../Menus/TitleImage';
import VerticalMenu from '../../common/Inputs/VerticalMenu'

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
		
		const midX = width/2 - 50;
		const bottomBuffer = 60;
		const buttonHeight = 30;
		const padding = 10;
		const startY = height - bottomBuffer - (buttonHeight+padding) * 5
		
		const buttons = [
			{
				text: "New Game",
				id: "new"
			},
			{
				text: "Load Game",
				id: "load"
			},
			{
				text: "Main Menu",
				id: "back"
			}
		]
		
		return (<Canvas
			width={width}
			height={height}
		>
			<TitleImage width={width} height={height} />
			<VerticalMenu
				buttons={buttons}
				midX={midX}
				startY={startY}
				padding={padding}
				height={buttonHeight}
				width={100}
				onSelect={(id) => {
					switch(id) {
					case "new":
						setPane(Panes.NEW_MAP_SELECT);
						break;
					case "load":
						setPane(Panes.LOAD_GAME_SELECT);
						break;
					case "back":
						setPane(Panes.HOME);
						break;
					}
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