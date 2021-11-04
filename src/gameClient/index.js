import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { SizeProvider } from '@bucky24/mobile-detect';
import store from './store';

ReactDOM.render(<Provider store={store}>
	<SizeProvider>
		<App />
	</SizeProvider>
</Provider>, document.getElementById('root'));
