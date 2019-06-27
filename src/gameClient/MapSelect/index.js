import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Text, Canvas } from '@bucky24/react-canvas';
import Button from '../../common/Button';
import { getFileList, loadFile, Types } from 'system';

import { Panes, setUIPane } from '../store/ducks/ui';
import { setGame } from '../store/ducks/game';

class MapSelect extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			maps: [],
			customMaps: []
		};
	}
	
	loadMap(type, mapName) {
		loadFile(type, mapName).then((data) => {
			this.props.loadGame(data);
			this.props.setPane(Panes.GAME);
		});
	}

	componentDidMount() {
		getFileList(Types.MAP).then((files) => {
			this.setState({
				maps: files
			});
		});
		getFileList(Types.MAP_CUSTOM).then((files) => {
			this.setState({
				customMaps: files
			});
		});
	}

	render() {
		const { width, height, setPane } = this.props;
		return (<Canvas
			width={width}
			height={height}
		>
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
			<Text x={0} y={12}>
				Base Maps
			</Text>
			{ this.state.maps.map((mapName, index) => {
				return <Button
					x={0}
					y={50*index + 20}
					width={200}
					height={50}
					text={mapName}
					onClick={() => {
						this.loadMap(Types.MAP, mapName);
					}}
				/>;
			})}
			<Text x={200} y={12}>
				Custom Maps
			</Text>
			{ this.state.customMaps.map((mapName, index) => {
				return <Button
					x={200}
					y={50*index + 20}
					width={200}
					height={50}
					text={mapName}
					onClick={() => {
						this.loadMap(Types.MAP_CUSTOM, mapName);
					}}
				/>;
			})}
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
		loadGame: (gameData) => {
			dispatch(setGame(gameData));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MapSelect);