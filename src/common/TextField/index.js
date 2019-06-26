import { CanvasComponent, Container, Text, Rect } from '@bucky24/react-canvas';
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	x: PropTypes.number,
	y: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number,
	onChange: PropTypes.func.isRequired
};

class TextField extends CanvasComponent {
	constructor(props) {
		super(props);
		
		this.state = {
			text: '',
			selected: false
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
	
	onMouseUp(data, onMe) {
		if (onMe) {
			this.setState({
				selected: !this.state.selected
			});
		} else {
			this.setState({
				selected: false
			});
		}
	}
	
	onKeyDown({ char, code }) {
		if (this.state.selected) {
			if (code === 'Backspace') {
				this.setState({
					text: this.state.text.substr(0, this.state.text.length-1)
				}, () => {
					if (this.props.onChange) {
						this.props.onChange(this.state.text);
					}
				});
			} else if (char) {
				this.setState({
					text: `${this.state.text}${char}`
				}, () => {
					if (this.props.onChange) {
						this.props.onChange(this.state.text);
					}
				});
			}
		}
	}
	
	render() {
		const { x, y, width, height } = this.props;
		
		const borderColor = this.state.selected ? "#0f0" : "#000";

		return <Container>
			<Rect
				x={x}
				y={y}
				x2={x+width}
				y2={y+height}
				color="#fff"
				fill={true}
			/>
			<Text
				x={x+3}
				y={y+12}j
			>
				{ this.state.text }
			</Text>
			<Rect
				x={x}
				y={y}
				x2={x+width}
				y2={y+height}
				color={borderColor}
				fill={false}
			/>
		</Container>;
	}
};

export default TextField;
