import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MobileDetect from 'mobile-detect';

ReactDOM.render(<MobileDetect>
	<App />
</MobileDetect>, document.getElementById('root'));
