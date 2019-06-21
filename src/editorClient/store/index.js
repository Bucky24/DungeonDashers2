import { combineReducers } from 'redux';
import ui from './ducks/ui';
import game from './ducks/game';

const reducers = {
	ui,
	game
};

export default combineReducers(reducers);