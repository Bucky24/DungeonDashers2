import React, { Component } from 'react';
import Button from '../Button';
import { Container, Shape, Text, CanvasComponent } from '@bucky24/react-canvas';

class VerticalMenu extends CanvasComponent {
	constructor(props) {
		super(props);
		
		this.state = {
			activeMenuItem: 0
		};
	}

	onKeyUp({ code }) {
		switch (code) {
		case 'ArrowUp':
			this.setState({
				activeMenuItem: Math.max(this.state.activeMenuItem-1, 0)
			});
			break;
		case 'ArrowDown':
			this.setState({
				activeMenuItem: Math.min(
					this.state.activeMenuItem+1, this.props.buttons.length-1
				)
			});
			break;
		case 'Enter':
			this.props.onSelect(this.props.buttons[this.state.activeMenuItem].id);
			break;
		}
		this.context.forceRerender();
	}
	
	render() {
		const {
			buttons,
			midX,
			startY,
			padding,
			height,
			width,
			onSelect
		} = this.props;

		let y = startY
		return <Container>
			{ buttons.map(({ text, id }, index) => {
				const myY = y;
				y += height + padding;
				const active = index === this.state.activeMenuItem;
				const textColor = active ? '#000' : '#fff';
				return <Container key={id}>
					{ active && <Shape
						x={midX}
						y={myY}
						points={[
							{ x: 0, y: 0 },
							{ x: width, y: 0 },
							{ x: width, y: height },
							{ x: 0, y: height }
						]}
						color={"#f00"}
						fill={true}
					/> }
					<Text color={textColor} x={midX + 10} y={myY + 20}>
						{ text }
					</Text>
				</Container>;
			})}
		</Container>;
	}
}

export default VerticalMenu;
