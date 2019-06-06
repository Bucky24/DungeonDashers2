import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas, Shape, Image } from '@bucky24/react-canvas';
import Door from '../Door';

import { getTiles, getCharacters, getWalkable, getObjects } from '../store/getters/game';
import { setCharacter, setObject } from '../store/ducks/game';

// images for tiles
import Ground1 from '../assets/ground1.png';
import Terrain1 from '../assets/terrain1.png';
import Terrain2 from '../assets/terrain2.png';
import Terrain3 from '../assets/terrain3.png';
import Terrain4 from '../assets/terrain4.png';
// images for characters
import Character1 from '../assets/character1.png';
// objects
import Door1 from '../assets/door1.png';

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

const objectList = {
	'door': {
		image: Door1,
		yOff: -13,
		height: 45
	}
};

class GameMap extends Component {
	constructor(props) {
		super(props);
		
		this.moveActiveChar = this.moveActiveChar.bind(this);
		this.handleCollision = this.handleCollision.bind(this);
	}
	moveActiveChar(xOff, yOff) {
		// assume active is number 1 for now
		const activeIndex = 0;
		const activeChar = this.props.characters[activeIndex];
		const newX = activeChar.x + xOff;
		const newY = activeChar.y + yOff;
		
		const key = `${newX}_${newY}`;
		
		if (!this.props.walkable.includes(key)) {
			return;
		}
		this.props.setCharacter({
			x: newX,
			y: newY
		}, activeIndex);
		
		// check to see if we impacted an object
		const objectsCollided = this.props.objects.filter((object) => {
			return object.key === key;
		});
		
		if (objectsCollided.length > 0) {
			for (let i=0;i<objectsCollided.length;i++) {
				this.handleCollision({
					type: 'player',
					index: activeIndex
				}, objectsCollided[i]);
			}
		}
	}
	handleCollision(obj1, obj2) {
		// simple for now, more complex later
		if (obj1.type === 'player' && obj2.type === 'door') {
			// open the door
			if (!obj2.isOpen) {
				this.props.setObject(obj2.id, {
					isOpen: true
				});
			}
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
			{ this.props.objects.map((object) => {
				if (object.type === 'door') {
					return <Door
						x={object.x}
						y={object.y}
						isOpen={object.isOpen}
					/>
				}
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
		walkable: getWalkable(state),
		objects: getObjects(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setCharacter: (data, index) => {
			return dispatch(setCharacter(data, index));
		},
		setObject: (id, data) => {
			return dispatch(setObject(id, data));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GameMap);