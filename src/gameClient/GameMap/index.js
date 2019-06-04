import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas, Shape, Image } from '@bucky24/react-canvas';

import SampleMap from '../Samples/sample1.json';

// images for tiles
import Ground1 from '../assets/ground1.png';

const tileMap = {
	'ground1': Ground1
};

class GameMap extends Component {
	render() {
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
			{ SampleMap.tiles.map((tile) => {
				return <Image
					x={tile.x * 32}
					y={tile.y * 32}
					width={32}
					height={32}
					src={tileMap[tile.tile]}
				/>;
			})}
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