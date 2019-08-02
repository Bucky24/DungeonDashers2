import { combineReducers } from 'redux';
import game from './ducks/game';

const reducers = {
	game
};

export default combineReducers(reducers);