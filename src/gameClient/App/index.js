import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SizeContext } from '@bucky24/mobile-detect';

import MenuHandler from '../MenuHandler';
import GameMap from '../GameMap';
import NewMapSelect from '../NewMapSelect';
import Loader from '../Loader';
import SaveLoadSelect from '../SaveLoadSelect';
import LoadGameSelect from '../LoadGameSelect';
import WonGame from '../WonGame/wonGame';
import EquipmentView from '../EquipmentView/equipmentView';
import Campaign from '../Campaign/campaign';

import './style.css';

import { getPane } from '../store/getters/ui';
import { Panes } from '../store/ducks/ui';

class App extends Component {
	render() {
        const { width, height } = this.context;
		const { pane } = this.props;

		return <div className="App">
			{ pane === Panes.LOAD && <Loader width={width} height={height} /> }
			{ pane === Panes.HOME && <MenuHandler width={width} height={height} /> }
			{ pane === Panes.GAME && <GameMap width={width} height={height} /> }		
			{ pane === Panes.NEW_MAP_SELECT && <NewMapSelect width={width} height={height} /> }		
			{ pane === Panes.SAVE_LOAD && <SaveLoadSelect width={width} height={height} /> }
			{ pane === Panes.LOAD_GAME_SELECT && <LoadGameSelect width={width} height={height} /> }
			{ pane === Panes.WON_GAME && <WonGame width={width} height={height} /> }
			{ pane === Panes.GAME_EQUIPMENT && <EquipmentView width={width} height={height} /> }
			{ pane === Panes.CAMPAIGN && <Campaign width={width} height={height} /> }
		</div>;
	}
}

App.contextType = SizeContext;

const mapStateToProps = (state) => {
	return {
		pane: getPane(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
	
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
