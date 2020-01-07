import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import MobileDetect from 'mobile-detect';
import store from './store';

ReactDOM.render(<Provider store={store}>
	<MobileDetect>
		<App />
	</MobileDetect>
</Provider>, document.getElementById('root'));
