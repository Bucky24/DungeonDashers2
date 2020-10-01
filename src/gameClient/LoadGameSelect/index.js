import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Rect, Canvas, Text, Container } from '@bucky24/react-canvas';
import { getFileList, loadFile, Types } from 'system';

import { loadExistingMap, loadSavedCampaign } from '../../common/utils/loader';
import TitleImage from '../Menus/TitleImage';
import VerticalMenu from '../../common/Inputs/VerticalMenu'

import { Panes, setUIPane } from '../store/ducks/ui';
import { setMap, setActiveCharacter, setMapMeta } from '../store/ducks/map';
import { getEnemyData, getCharacterData } from '../store/getters/gameData';
import { setActiveCampaign, setMaps, setCurrentMap, setIsCustom } from '../store/ducks/campaign';

class LoadGameSelect extends Component {
	constructor(props) {
		super(props);

		this.state = {
			mapGames: [],
			campaignGames: [],
			tab: null,
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

		let buttons = [
			{ text: "Single Maps", id: "maps" },
			{ text: "Campaigns", id: "campaigns" },
			{ text: "Back", id: "back" },
		];

		if (this.state.tab === "maps") {
			buttons = [];
			this.state.mapGames.forEach((mapName) => {
				buttons.push({ text: mapName, id: mapName });
			})
			buttons.push({ text: "Back", id: "back" });
		} else if (this.state.tab === "campaigns") {
			buttons = [];
			this.state.campaignGames.forEach((mapName) => {
				buttons.push({ text: mapName, id: mapName });
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
				onSelect={async (id) => {
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
						} else {
							try {
								await loadExistingMap(id, this.props.enemyData, this.props.characterData, this.props.setMap, this.props.setActiveCharacter, this.props.setMapMeta);
								this.props.setPane(Panes.GAME);
							} catch (e) {
								console.error(e);
							}
						}
					} else if (this.state.tab === "campaigns") {
						if (!id) {
							return;
						}
						if (id === "back") {
							this.setState({ tab: null });
						} else {
							await loadSavedCampaign(
								id,
								this.props.setActiveCampaign,
								this.props.setMaps,
								this.props.setCurrentMap,
								this.props.setIsCustom,
							);
							this.props.setPane(Panes.CAMPAIGN);
						}
					}
				}}
			/>
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
		},
		setActiveCampaign: (campaign) => {
			dispatch(setActiveCampaign(campaign));
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

export default connect(mapStateToProps, mapDispatchToProps)(LoadGameSelect);