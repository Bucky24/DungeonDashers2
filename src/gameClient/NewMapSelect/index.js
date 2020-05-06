import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Text, Canvas, Rect } from '@bucky24/react-canvas';
import Button from '../../common/Button';
import { getFileList, loadFile, Types } from 'system';

import { Panes, setUIPane } from '../store/ducks/ui';
import { setMap, setActiveCharacter, setMapMeta } from '../store/ducks/map';
import { getEnemyData, getCharacterData } from '../store/getters/gameData';
import { loadNewMap, loadNewCampaign } from '../../common/utils/loader';
import { setActiveCampaign, setMaps, setCurrentMap, setIsCustom } from '../store/ducks/campaign';

class NewMapSelect extends Component {
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
	
	loadMap(type, mapName) {
		loadNewMap(type, mapName, this.props.enemyData, this.props.characterData, this.props.setMap, this.props.setActiveCharacter, this.props.setMapMeta);
		this.props.setPane(Panes.GAME);
	}

	async loadCampaign(type, campaignName) {
		await loadNewCampaign(
			type,
			campaignName,
			this.props.setActiveCampaign,
			this.props.setMaps,
			this.props.setCurrentMap,
			this.props.setIsCustom,
		);
		this.props.setPane(Panes.CAMPAIGN);
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
		getFileList(Types.CAMPAIGN).then((files) => {
			this.setState({
				campaigns: files
			});
		});
		getFileList(Types.CAMPAIGN_CUSTOM).then((files) => {
			this.setState({
				customCampaigns: files
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
					Base Maps
				</Text>
				{ this.state.maps.map((mapName, index) => {
					return <Button
						key={`base_${index}`}
						x={0}
						y={50*index + 65}
						width={200}
						height={50}
						text={mapName}
						onClick={() => {
							this.loadMap(Types.MAP, mapName);
						}}
					/>;
				})}
				<Text x={210} y={62}>
					Custom Maps
				</Text>
				{ this.state.customMaps.map((mapName, index) => {
					return <Button
						key={`custom_${index}`}
						x={210}
						y={50*index + 65}
						width={200}
						height={50}
						text={mapName}
						onClick={() => {
							this.loadMap(Types.MAP_CUSTOM, mapName);
						}}
					/>;
				})}
			</Container> }
			{ this.state.tab === 'campaigns' && <Container>
				<Text x={0} y={62}>
					Base Campaigns
				</Text>
				{ this.state.campaigns.map((mapName, index) => {
					return <Button
						key={`base_camp_${index}`}
						x={0}
						y={50*index + 65}
						width={200}
						height={50}
						text={mapName}
						onClick={() => {
							this.loadCampaign(Types.CAMPAIGN, mapName);
						}}
					/>;
				})}
				<Text x={210} y={62}>
					Custom Campaigns
				</Text>
				{ this.state.customCampaigns.map((mapName, index) => {
					return <Button
						key={`custom_camp_${index}`}
						x={210}
						y={50*index + 65}
						width={200}
						height={50}
						text={mapName}
						onClick={() => {
							this.loadCampaign(Types.CAMPAIGN_CUSTOM, mapName);
						}}
					/>;
				})}
			</Container> }
		</Canvas>);
	}
}

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
		setActiveCampaign: (campaign) => {
			dispatch(setActiveCampaign(campaign));
		},
		setMapMeta: (name, custom) => {
			dispatch(setMapMeta(name, custom));
		},
		setMaps: (maps) => {
			dispatch(setMaps(maps));
		},
		setCurrentMap: (map) => {
			dispatch(setCurrentMap(map));
		},
		setIsCustom: (custom) => {
			dispatch(setIsCustom(custom));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(NewMapSelect);