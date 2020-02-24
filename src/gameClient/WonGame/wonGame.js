import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Text, Canvas } from '@bucky24/react-canvas';

class WonGame extends Component {
	constructor(props) {
		super(props);
		
		this.state = {};
	}

	render() {
		const { width, height, setPane } = this.props;
		return (<Canvas
			width={width}
			height={height}
		>
			<Text
				x={200}
				y={200}
			>You win!</Text>
		</Canvas>);
	}
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WonGame);