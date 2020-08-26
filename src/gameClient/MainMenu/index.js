import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from '@bucky24/react-canvas';
import VerticalMenu from '../../common/Inputs/VerticalMenu';

import { Panes, setUIPane } from '../store/ducks/ui';

class MainMenu extends Component {
	render() {
		const { setPane, width, height } = this.props;
		
		const midX = width/2 - 50;
		const bottomBuffer = 60;
		const buttonHeight = 30;
		const padding = 10;
		const startY = height - bottomBuffer - (buttonHeight+padding) * 5
		
		const buttons = [
			{
				text: "SINGLEPLAYER",
				id: "single"
			},
			{
				text: "MULTIPLAYER",
				id: "multi"
			},
			{
				text: "OPTIONS",
				id: "options"
			},
			{
				text: "CREDITS",
				id: "credits"
			},
			{
				text: "QUIT",
				id: "quit"
			}
		]

		return (<Container>
			<VerticalMenu
				buttons={buttons}
				midX={midX}
				startY={startY}
				padding={padding}
				height={buttonHeight}
				width={100}
				onSelect={(id) => {
					switch(id) {
					case "single":
						setPane(Panes.SAVE_LOAD);
						break;
					}
				}}
			/>
		</Container>);
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
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);

