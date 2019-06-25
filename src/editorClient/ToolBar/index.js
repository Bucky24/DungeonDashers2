import React, { Component } from 'react';
import { Container, Text, Shape } from '@bucky24/react-canvas';
import Button from '../../common/Button';

const ToolBar = ({
	activeTool,
	width,
	height,
	tools,
	setActiveTool
}) => {
	return <Container>
		<Shape
			x={0}
			y={0}
			points={[
				{ x: width, y: 0 },
				{ x: width, y: height },
				{ x: 0, y: height },
				{ x: 0, y: 0 }
			]}
			color="#fff"
			fill={true}
		/>
		{ tools.map(({ id, name }, index) => {
			return <Button
				key={id}
				x={0}
				y={50 * index}
				width={width}
				height={50}
				text={name}
				onClick={() => {
					setActiveTool(id);
				}}
				toggle={id === activeTool}
			/>
		})}
	</Container>;
};

export default ToolBar;
