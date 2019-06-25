import React, { Component } from 'react';
import { Container, Text, Shape } from '@bucky24/react-canvas';
import Button from '../../common/Button';

const BottomBar = ({
	x,
	y,
	width,
	height,
	activeTool
}) => {
	return <Container>
		<Shape
			x={x}
			y={y}
			points={[
				{ x: width, y: 0 },
				{ x: width, y: height },
				{ x: 0, y: height },
				{ x: 0, y: 0 }
			]}
			color="#fff"
			fill={true}
		/>
	</Container>;
};

export default BottomBar;
