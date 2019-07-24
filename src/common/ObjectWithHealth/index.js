import React, { Component } from 'react';
import { Container, Image, Shape, Rect } from '@bucky24/react-canvas';

class ObjectWithHealth extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {
			x,
			y,
			width,
			height,
			image,
			maxHP,
			hp,
			selected
		} = this.props;
		
		const widthPerPixel = width / maxHP;
		const hpWidth = widthPerPixel * hp;

		return <Container>
			<Image
				x={x}
				y={y}
				width={width}
				height={height}
				src={image}
			/>;
			<Shape
				x={x}
				y={y}
				points={[
					{ x: 0, y: -10 },
					{ x: width, y: -10 },
					{ x: width, y: 0 },
					{ x: 0, y: 0 }
				]}
				color="#f00"
				fill={true}
			/>
			<Shape
				x={x}
				y={y}
				points={[
					{ x: 0, y: -10 },
					{ x: hpWidth, y: -10 },
					{ x: hpWidth, y: 0 },
					{ x: 0, y: 0 }
				]}
				color="#0f0"
				fill={true}
			/>
			{ selected && <Rect
				x={x}
				y={y}
				x2={x+width}
				y2={y+height}
				color="#f00"
				fill={false}
			/>}
		</Container>;
	}
}

export default ObjectWithHealth;