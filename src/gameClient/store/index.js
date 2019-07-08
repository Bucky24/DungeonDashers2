import { combineReducers } from 'redux';
import ui from './ducks/ui';
import map from './ducks/map';
import gameData from './ducks/gameData';

const reducers = {
	ui,
	map,
	gameData
};

export default combineReducers(reducers);