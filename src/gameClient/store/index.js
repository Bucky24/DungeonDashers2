import { combineReducers } from 'redux';
import ui from './ducks/ui';
import map from './ducks/map';
import gameData from './ducks/gameData';
import campaign from './ducks/campaign';

const reducers = {
	ui,
	map,
	gameData,
	campaign
};

export default combineReducers(reducers);