import React from 'react';
import PropTypes from 'prop-types';
import { Shape, Image, CanvasComponent, Container, Canvas } from '@bucky24/react-canvas';
import Door from '../Door';
import ObjectWithHealth from '../ObjectWithHealth';

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
// enemies
import EnemyBat from '../assets/enemyBat.png';

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

const enemyList = {
	'bat': {
		image: EnemyBat,
		height: 32
	}
};

const propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	tiles: PropTypes.array.isRequired,
	objects: PropTypes.array.isRequired,
	characters: PropTypes.array.isRequired,
	enemies: PropTypes.array.isRequired,
	onKeyUp: PropTypes.func,
	onClick: PropTypes.func
};

const SQUARE_SIZE = 32;

class Map extends CanvasComponent {
	constructor(props) {
		super(props);
		
        this.bounds = {
            x: props.x,
            y: props.y,
            width: props.width,
            height: props.height
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
	
	onKeyUp(evt) {
		if (this.props.onKeyUp) {
			this.props.onKeyUp(evt);
		}
	}
	
    onMouseUp({ x, y, button }, overMe) {
        if (overMe && this.props.onClick) {
        	const squareX = Math.floor((x - this.props.x)/SQUARE_SIZE);
			const squareY = Math.floor((y - this.props.y)/SQUARE_SIZE);
			this.props.onClick(squareX, squareY, button);
        }
    }

	render() {
		const { x, y, width, height, onKeyUp } = this.props;
		return (<Container
		>
			{ /* draw the background */ }
			<Shape
				x={x}
				y={y}
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
					x={x+ tile.x * 32}
					y={y+ tile.y * 32}
					width={32}
					height={32}
					src={tileMap[tile.tile]}
				/>;
			})}
			{ this.props.objects.map((object) => {
				if (object.type === 'door') {
					return <Door
						x={x/SQUARE_SIZE + object.x}
						y={y/SQUARE_SIZE + object.y}
						isOpen={object.isOpen}
					/>
				}
			})}
			{ this.props.characters.map((characterPos, index) => {
				const image = characterList[index];
				// since character images are 96 pixels, and we
				// want to draw from the feet, we have to go 2 up
				const drawPosition = characterPos.y-2;
				return <ObjectWithHealth
					x={x/SQUARE_SIZE + characterPos.x}
					y={y/SQUARE_SIZE + drawPosition}
					width={32}
					height={96}
					image={image}
					hp={1}
					maxHP={1}
				/>;
			})}
			{ this.props.enemies.map((enemy) => {
				const imageData = enemyList[enemy.type];
				return <ObjectWithHealth
					x={x/SQUARE_SIZE + enemy.x}
					y={y/SQUARE_SIZE + enemy.y}
					width={32}
					height={imageData.height}
					image={imageData.image}
					hp={enemy.hp}
					maxHP={10}
				/>;
			})}
		</Container>);
	}
}

export default Map;