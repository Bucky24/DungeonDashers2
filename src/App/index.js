import React, { Component } from 'react';
import MenuHandler from '../MenuHandler';
import './style.css';

class App extends Component {
	render() {
		const { width, height } = this.props;

		return <div className="App">
			<MenuHandler width={width} height={height} />
		</div>;
	}
}

export default App;
