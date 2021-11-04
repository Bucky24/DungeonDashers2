import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore , compose } from 'redux';
import { SizeProvider } from '@bucky24/mobile-detect';

import App from './App';
import reducers from './store';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createStoreWithMiddleware = composeEnhancers()(createStore);

const store = createStoreWithMiddleware(reducers);

ReactDOM.render(<Provider store={store}>
    <SizeProvider>
	    <App />
    </SizeProvider>
</Provider>, document.getElementById('root'));
