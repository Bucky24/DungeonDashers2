import React, { Component } from 'react';
import { Container, Image } from '@bucky24/react-canvas';

import Door1 from '../assets/door1.png';

class Door extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { x, y, isOpen } = this.props;

		const drawPosition = y*32-13;
		const width = isOpen ? 5 : 32;
		return <Container>
			<Image
				x={x * 32}
				y={drawPosition}
				width={width}
				height={45}
				src={Door1}
			/>;
		</Container>;
	}
}

export default Door;