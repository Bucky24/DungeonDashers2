import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Text, Canvas, Rect } from '@bucky24/react-canvas';
import Button from '../../common/Button';
import { getFileList, loadFile, Types } from 'system';

import { Panes, setUIPane } from '../store/ducks/ui';
import { getActiveCampaign, getMaps, getCurrentMap } from '../store/getters/campaign';
import { getMapMeta } from '../store/getters/map';
import { getEnemyData, getCharacterData } from '../store/getters/gameData';
import { setMap, setActiveCharacter, setMapMeta } from '../store/ducks/map';
import { loadNewMap } from '../../common/utils/loader';

class Campaign extends Component {
	constructor(props) {
		super(props);
	}
	
	async loadMap(map) {
		// this is sloppy, will need to fix eventually
		const nonCustomMaps = await getFileList(Types.MAP);
		const type = nonCustomMaps.includes(map) ? Types.MAP : Types.MAP_CUSTOM;
		loadNewMap(type, map, this.props.enemyData, this.props.characterData, this.props.setMap, this.props.setActiveCharacter, this.props.setMapMeta);
		this.props.setPane(Panes.GAME);
	}

	render() {
		const { width, height, setPane, mapMeta, maps, currentMap } = this.props;
		
		const metaIndex = maps.indexOf(currentMap);
		
		return (<Canvas
			width={width}
			height={height}
		>
			<Button
				x={0}
				y={height-50}
				width={200}
				height={50}
				text="Back"
				onClick={() => {
					setPane(Panes.SAVE_LOAD);
				}}
			/>
			<Text
				x={0}
				y={20}
			>{ this.props.activeCampaign}</Text>
			<Text
				x={0}
				y={40}
			>Maps:</Text>
			{ this.props.maps.map((map, index) => {
				if (index === 0 && metaIndex < 0) {
					return <Button
						key={index}
						x={0}
						y={40 + index*50}
						width={200}
						height={50}
						text={`${map} - Begin!`}
						onClick={() => {
							this.loadMap(map);
						}}
					/>
				} else if (index <= metaIndex) {
					return <Button
						key={index}
						x={0}
						y={40 + index*50}
						width={200}
						height={50}
						text={index < metaIndex ? `${map} (replay)` : `${map} (continue)`}
						onClick={() => {
							this.loadMap(map);
						}}
					/>
				} else {
					return <Text
						key={index}
						x={0}
						y={40 + index*50 + 20}
					>
						{ `${map} - Finish earlier missions to unlock`}
					</Text>
				}
			})}
		</Canvas>);
	}
}

const mapStateToProps = (state) => {
	return {
		activeCampaign: getActiveCampaign(state),
		maps: getMaps(state),
		mapMeta: getMapMeta(state),
		enemyData: getEnemyData(state),
		characterData: getCharacterData(state),
		currentMap: getCurrentMap(state),
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setPane: (pane) => {
			dispatch(setUIPane(pane));
		},
		setMap: (gameData) => {
			dispatch(setMap(gameData));
		},
		setActiveCharacter: (index) => {
			dispatch(setActiveCharacter(index));
		},
		setMapMeta: (name, custom) => {
			dispatch(setMapMeta(name, custom));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Campaign);