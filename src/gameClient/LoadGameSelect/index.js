import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Rect, Canvas, Text, Container } from '@bucky24/react-canvas';
import { getFileList, loadFile, Types } from 'system';

import { loadExistingMap } from '../../common/utils/loader';
import Button from '../../common/Button';

import { Panes, setUIPane } from '../store/ducks/ui';
import { setMap, setActiveCharacter, setMapMeta } from '../store/ducks/map';
import { getEnemyData, getCharacterData } from '../store/getters/gameData';

class LoadGameSelect extends Component {
	constructor(props) {
		super(props);

		this.state = {
			mapGames: [],
			campaignGames: [],
			tab: 'campaigns'
		};
	}
	

	componentDidMount() {
		getFileList(Types.SAVED_MAP).then((files) => {
			this.setState({
				mapGames: files
			});
		});
		getFileList(Types.SAVED_CAMPAIGN).then((files) => {
			this.setState({
				campaignGames: files
			});
		});
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
			<Button
				x={0}
				y={0}
				width={200}
				height={50}
				text="Campaigns"
				toggle={this.state.tab === 'campaigns'}
				onClick={() => {
					this.setState({
						tab: 'campaigns'
					});
				}}
			/>
			<Button
				x={210}
				y={0}
				width={200}
				height={50}
				text="Maps"
				toggle={this.state.tab === 'maps'}
				onClick={() => {
					this.setState({
						tab: 'maps'
					});
				}}
			/>
			{ this.state.tab === 'maps' && <Container>
				<Text x={0} y={62}>
					Single Map Saves
				</Text>
				{ this.state.mapGames.map((mapName, index) => {
					return <Button
						key={`base_${index}`}
						x={0}
						y={50*index + 65}
						width={200}
						height={50}
						text={mapName}
						onClick={() => {
							loadExistingMap(mapName, this.props.enemyData, this.props.characterData, this.props.setMap, this.props.setActiveCharacter, this.props.setMapMeta);
							this.props.setPane(Panes.GAME);
						}}
					/>;
				})}
			</Container> }
			{ this.state.tab === 'campaigns' && <Container>
				<Text x={0} y={62}>
					Saved Campaigns
				</Text>
				{ this.state.campaignGames.map((campName, index) => {
					return <Button
						key={`base_${index}`}
						x={0}
						y={50*index + 65}
						width={200}
						height={50}
						text={campName}
						onClick={() => {
							loadCampaign(Types.SAVED_CAMPAIGN, campName, false);
						}}
					/>;
				})}
			</Container> }
		</Canvas>);
	}
};

const mapStateToProps = (state) => {
	return {
		enemyData: getEnemyData(state),
		characterData: getCharacterData(state)
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
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadGameSelect);