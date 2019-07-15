import React, { Component } from 'react';
import { Container, Image } from '@bucky24/react-canvas';

class Object extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { x, y, image, yOff, height, width } = this.props;

		const drawPosition = y-yOff;
		return <Container>
			<Image
				x={x}
				y={drawPosition}
				width={width}
				height={height}
				src={image}
			/>;
		</Container>;
	}
}

export default Object;
