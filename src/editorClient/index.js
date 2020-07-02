import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore , compose } from 'redux';
import App from './App';
import MobileDetect from 'mobile-detect';
import reducers from './store';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createStoreWithMiddleware = composeEnhancers()(createStore);

const store = createStoreWithMiddleware(reducers);

ReactDOM.render(<Provider store={store}>
	<MobileDetect>
		<App />
	</MobileDetect>
</Provider>, document.getElementById('root'));
