import { CanvasComponent, Container, Text, Shape } from '@bucky24/react-canvas';
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	x: PropTypes.number,
	y: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number,
	text: PropTypes.string,
	onClick: PropTypes.func.isRequired,
	toggle: PropTypes.bool
};

class Button extends CanvasComponent {
	constructor(props) {
		super(props);
		
		this.state = {
			mouseOver: false
		};
		
		this.bounds = {
			x: this.props.x,
			y: this.props.y,
			width: this.props.width,
			height: this.props.height
		};
	}
	componentDidUpdate() {
		this.bounds = {
			x: this.props.x,
			y: this.props.y,
			width: this.props.width,
			height: this.props.height
		};
	}
	onMouseMove(data, overMe) {
		this.setState({
			mouseOver: overMe
		});
	}
	onMouseUp(data, overMe) {
		if (overMe && this.props.onClick) {
			this.props.onClick();
		}
	}
	render() {
		let color = '#f00';
		if (this.props.toggle) {
			color = '#00f';
		}
		if (this.state.mouseOver) {
			color = '#0f0';
		}
		return (<Container>
			<Shape
				x={this.props.x}
				y={this.props.y}
				points={[
					{ x: 0, y: 0 },
					{ x: this.props.width, y: 0 },
					{ x: this.props.width, y: this.props.height },
					{ x: 0, y: this.props.height }
				]}
				color={color}
				fill={true}
			/>
			<Text x={this.props.x + 10} y={this.props.y + 20}>
				{ this.props.text }
			</Text>
		</Container>);
	}
};

Button.propTypes = propTypes;

export default Button;