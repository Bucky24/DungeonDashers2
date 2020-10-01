import React from 'react';
import { Container, Shape, Text, CanvasComponent, Rect } from '@bucky24/react-canvas';

class VerticalMenu extends CanvasComponent {
	constructor(props) {
		super(props);
		
		this.state = {
			activeMenuItem: 0
		};
	}

	onKeyUp({ code }) {
		let doRerender = true;
		let nextItem;
		let item;
		switch (code) {
		case 'ArrowUp':
			nextItem = this.state.activeMenuItem - 1;
			if (nextItem < 0) {
				nextItem = this.props.buttons.length-1;
			}
			this.setState({
				activeMenuItem: nextItem,
			});
			break;
		case 'ArrowDown':
			nextItem = this.state.activeMenuItem + 1;
			if (nextItem > this.props.buttons.length-1) {
				nextItem = 0;
			}
			this.setState({
				activeMenuItem: nextItem,
			});
			break;
		case 'Enter':
			item = this.props.buttons[this.state.activeMenuItem];
			if (item.type === "header") {
				return;
			}
			doRerender = false;
			this.setState({
				activeMenuItem: 0,
			}, () => {
				this.props.onSelect(item.id);
			});
			break;
		}
		if (doRerender) {
			this.context.forceRerender();
		}
	}
	
	render() {
		const {
			buttons,
			midX,
			startY,
			padding,
			height,
			width,
		} = this.props;

		let y = startY
		const fullHeight = buttons.length * height + buttons.length * padding
		return <Container>
			<Rect
				x={midX-width/2}
				y={startY-padding}
				x2={midX+width*1.5}
				y2={startY+fullHeight}
				color="rgba(0,0,255,0.3)"
				fill={true}
			/>
			{ buttons.map(({ text, id, type }, index) => {
				const myY = y;
				y += height + padding;
				const active = index === this.state.activeMenuItem;
				const textColor = active ? '#000' : '#fff';
				const fontSize = type === "header" ? "14px" : "12px";
				return <Container key={id || text}>
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
					<Text color={textColor} x={midX + 10} y={myY + 20} font={`${fontSize} Arial`}>
						{ text }
					</Text>
				</Container>;
			})}
		</Container>;
	}
}

export default VerticalMenu;
