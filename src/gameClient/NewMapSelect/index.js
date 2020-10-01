import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Text, Canvas, Rect } from '@bucky24/react-canvas';
import Button from '../../common/Button';
import { getFileList, loadFile, Types } from 'system';

import TitleImage from '../Menus/TitleImage';
import VerticalMenu from '../../common/Inputs/VerticalMenu'

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
			tab: null,
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

		let buttons = [
			{ text: "Single Maps", id: "maps" },
			{ text: "Campaigns", id: "campaigns" },
			{ text: "Back", id: "back" },
		];

		if (this.state.tab === "maps") {
			buttons = [];
			buttons.push({ text: "Base Maps", type: "header" });
			this.state.maps.forEach((mapName) => {
				buttons.push({ text: mapName, id: `map_${mapName}` });
			})
			buttons.push({ text: "Custom Maps", type: "header" });
			this.state.customMaps.forEach((mapName) => {
				buttons.push({ text: mapName, id: `custom_${mapName}` });
			})
			buttons.push({ text: "Back", id: "back" });
		} else if (this.state.tab === "campaigns") {
			buttons = [];
			buttons.push({ text: "Base Campaigns", type: "header" });
			this.state.campaigns.forEach((mapName) => {
				buttons.push({ text: mapName, id: `camp_${mapName}` });
			})
			buttons.push({ text: "Custom Campaigns", type: "header" });
			this.state.customCampaigns.forEach((mapName) => {
				buttons.push({ text: mapName, id: `custom_${mapName}` });
			})
			buttons.push({ text: "Back", id: "back" });
		}

		const midX = width/2 - 50;
		const bottomBuffer = 60;
		const buttonHeight = 30;
		const padding = 10;
		const startY = height - bottomBuffer - (buttonHeight+padding) * buttons.length;

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
					if (this.state.tab === null) {
						switch(id) {
						case "maps":
						case "campaigns":
							this.setState({ tab: id });
							break;
						case "back":
							setPane(Panes.SAVE_LOAD);
							break;
						}
					} else if (this.state.tab === "maps") {
						if (!id) {
							return;
						}
						if (id === "back") {
							this.setState({ tab: null });
						} else if (id.includes("map_")) {
							const name = id.replace("map_", "");
							this.loadMap(Types.MAP, name);
						} else if (id.includes("custom_")) {
							const name = id.replace("custom_", "");
							this.loadMap(Types.MAP_CUSTOM, name);
						}
					} else if (this.state.tab === "campaigns") {
						if (!id) {
							return;
						}
						if (id === "back") {
							this.setState({ tab: null });
						} else if (id.includes("camp_")) {
							const name = id.replace("camp_", "");
							this.loadCampaign(Types.CAMPAIGN, name);
						} else if (id.includes("custom_")) {
							const name = id.replace("custom_", "");
							this.loadCampaign(Types.CAMPAIGN_CUSTOM, name);
						}
					}
				}}
			/>
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