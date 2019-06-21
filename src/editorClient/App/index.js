import React, { Component } from 'react';
import { connect } from 'react-redux';

import './style.css';

class App extends Component {
	render() {
		const { width, height, pane } = this.props;

		return <div className="App">
			Editor
		</div>;
	}
}

const mapStateToProps = (state) => {
	return {

	};
};

const mapDispatchToProps = (dispatch) => {
	return {
	
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
