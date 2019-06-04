import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas, Shape, Image } from '@bucky24/react-canvas';

import { getTiles, getCharacters, getWalkable } from '../store/getters/game';
import { setCharacter } from '../store/ducks/game';

// images for tiles
import Ground1 from '../assets/ground1.png';
import Terrain1 from '../assets/terrain1.png';
import Terrain2 from '../assets/terrain2.png';
import Terrain3 from '../assets/terrain3.png';
import Terrain4 from '../assets/terrain4.png';
// images for characters
import Character1 from '../assets/character1.png';

const tileMap = {
	'ground1': Ground1,
	'terrain1': Terrain1,
	'terrain2': Terrain2,
	'terrain3': Terrain3,
	'terrain4': Terrain4
};

const characterList = [
	Character1
];

class GameMap extends Component {
	constructor(props) {
		super(props);
		
		this.moveActiveChar = this.moveActiveChar.bind(this);
	}
	moveActiveChar(xOff, yOff) {
		// assume active is number 1 for now
		const activeIndex = 0;
		const activeChar = this.props.characters[activeIndex];
		const newX = activeChar.x + xOff;
		const newY = activeChar.y + yOff;
		
		const key = `${newX}_${newY}`;
		
		if (this.props.walkable.includes(key)) {
			this.props.setCharacter({
				x: newX,
				y: newY
			}, activeIndex);
		}
	}
	render() {
		const { width, height } = this.props;
		return (<Canvas
			width={width}
			height={height}
			onKeyUp={({ code }) => {
				if (code === 'ArrowLeft') {
					this.moveActiveChar(-1, 0);
				} else if (code === 'ArrowRight') {
					this.moveActiveChar(1, 0);
				} else if (code === 'ArrowDown') {
					this.moveActiveChar(0, 1);
				} else if (code === 'ArrowUp') {
					this.moveActiveChar(0, -1);
				}
			}}
		>
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
			{ this.props.tiles.map((tile) => {
				return <Image
					x={tile.x * 32}
					y={tile.y * 32}
					width={32}
					height={32}
					src={tileMap[tile.tile]}
				/>;
			})}
			{ this.props.characters.map((characterPos, index) => {
				const image = characterList[index];
				// since character images are 96 pixels, and we
				// want to draw from the feet, we have to go 2 up
				const drawPosition = characterPos.y-2;
				return <Image
					x={characterPos.x * 32}
					y={drawPosition * 32}
					width={32}
					height={96}
					src={image}
				/>;
			})}
		</Canvas>);
	}
}

const mapStateToProps = (state) => {
	return {
		tiles: getTiles(state),
		characters: getCharacters(state),
		walkable: getWalkable(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setCharacter: (data, index) => {
			return dispatch(setCharacter(data, index));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GameMap);