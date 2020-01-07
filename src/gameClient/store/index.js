import { combineReducers } from 'redux';
import ui from './ducks/ui';
import map from './ducks/map';
import gameData from './ducks/gameData';
import campaign from './ducks/campaign';
import { createStore , compose } from 'redux';

const reducers = {
	ui,
	map,
	gameData,
	campaign
};

const combinedReducers = combineReducers(reducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createStoreWithMiddleware = composeEnhancers()(createStore);

const store = createStoreWithMiddleware(combinedReducers);

export default store;
