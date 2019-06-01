import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas, Shape } from '@bucky24/react-canvas';

import SampleMap from '../Samples/sample1.json';

class GameMap extends Component {
	render() {
		console.log(SampleMap);
		const { width, height } = this.props;
		return (<Canvas width={width} height={height}>
			{ /* draw the background */ }
			<Shape
				x={0}
				y={0}
				points={[
					{ x: 0, y: 0 },
					{ x: width, y: 0 },
					{ x: width, y: height },
					{ x: 0, y: height }
				]}
				color="#000"
				fill={true}
			/>
		</Canvas>);
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

export default connect(mapStateToProps, mapDispatchToProps)(GameMap);