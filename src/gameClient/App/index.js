import React, { Component } from 'react';
import { connect } from 'react-redux';
import MenuHandler from '../MenuHandler';
import GameMap from '../GameMap';

import './style.css';

import { getPane } from '../store/getters/ui';
import { Panes } from '../store/ducks/ui';

class App extends Component {
	render() {
		const { width, height, pane } = this.props;

		return <div className="App">
			{ pane === Panes.HOME && <MenuHandler width={width} height={height} /> }
			{ pane === Panes.GAME && <GameMap width={width} height={height} /> }
		</div>;
	}
}

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
