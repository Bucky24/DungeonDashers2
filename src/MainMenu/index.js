import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Text } from '@bucky24/react-canvas';
import Button from '../Button';
//import './style.css';

import { Panes, setUIPane } from '../store/ducks/ui';

class MainMenu extends Component {
	render() {
		const { setPane } = this.props;
		return (<Container>
			<Text x={100} y={100}>
				Main Menu
			</Text>
			<Button
				x={0}
				y={200}
				width={100}
				height={50}
				text="SINGLEPLAYER"
				onClick={() => {
					setPane(Panes.GAME);
				}}
			/>
			<Button
				x={110}
				y={200}
				width={100}
				height={50}
				text="MULTIPLAYER"
			/>
			<Button
				x={220}
				y={200}
				width={100}
				height={50}
				text="OPTIONS"
			/>
			<Button
				x={330}
				y={200}
				width={100}
				height={50}
				text="CREDITS"
			/>
			<Button
				x={440}
				y={200}
				width={100}
				height={50}
				text="QUIT"
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

