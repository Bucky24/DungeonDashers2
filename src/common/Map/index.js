import React from 'react';
import PropTypes from 'prop-types';
import { Shape, Image, CanvasComponent, Container, Canvas, Rect } from '@bucky24/react-canvas';
import Door from '../Door';
import ObjectWithHealth from '../ObjectWithHealth';
import Object from '../Object';

// images for tiles
import Ground1 from '../assets/ground1.png';
import Terrain1 from '../assets/terrain1.png';
import Terrain2 from '../assets/terrain2.png';
import Terrain3 from '../assets/terrain3.png';
import Terrain4 from '../assets/terrain4.png';
import Terrain5 from '../assets/terrain5.png';
import Terrain6 from '../assets/terrain6.png';
import Terrain7 from '../assets/terrain7.png';
import Terrain8 from '../assets/terrain8.png';
import Terrain9 from '../assets/terrain9.png';

const tileMap = {
	'ground1': Ground1,
	'terrain1': Terrain1,
	'terrain2': Terrain2,
	'terrain3': Terrain3,
	'terrain4': Terrain4,
	'terrain5': Terrain5,
	'terrain6': Terrain6,
	'terrain7': Terrain7,
	'terrain8': Terrain8,
	'terrain9': Terrain9,
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
	onClick: PropTypes.func,
	enemyData: PropTypes.object.isRequired,
	characterData: PropTypes.object.isRequired,
	activeLocations: PropTypes.array,
};

const defaultProps = {
	activeLocations: [],
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
			{ this.props.tiles.map((tile, index) => {
				return <Image
					key={`tile_${index}`}
					x={x+ tile.x * 32}
					y={y+ tile.y * 32}
					width={32}
					height={32}
					src={tileMap[tile.tile]}
				/>;
			})}
			{ this.props.objects.map((object, index) => {
				const data = this.props.objectData[object.type];
				if (object.type === 'door') {
					return <Door
						key={`object_${index}`}
						x={x/SQUARE_SIZE + object.x}
						y={y/SQUARE_SIZE + object.y}
						isOpen={object.isOpen}
						image={data.imageData.image}
					/>
				} else {
					return <Object
						key={`object_${index}`}
						x={x + object.x * SQUARE_SIZE}
						y={y + object.y * SQUARE_SIZE}
						image={data.imageData.image}
						yOff={data.yOff}
						height={data.imageData.height}
						width={data.imageData.width}
					/>
				}
			})}
			{ this.props.characters.map((characterObj, index) => {
				const data = this.props.characterData[characterObj.ident];
				const { imageData } = data;
				// since character images are 96 pixels, and we
				// want to draw from the feet, we have to go 2 up
				const drawPosition = characterObj.y-2;
				return <ObjectWithHealth
					key={`character_${index}`}
					x={x + characterObj.x*SQUARE_SIZE}
					y={y + drawPosition*SQUARE_SIZE}
					width={imageData.width}
					height={imageData.height}
					image={imageData.image}
					hp={characterObj.hp || 1}
					selected={characterObj.selected}
					maxHP={characterObj.maxHP || 1}
				/>;
			})}
			{ this.props.enemies.map((enemy, index) => {
				const enemyData = this.props.enemyData[enemy.type];
				if (!enemyData) {
					console.error(`Unknown enemy type ${enemy.type}`);
					return null;
				}
				const actualEnemyY = enemy.y * SQUARE_SIZE;
				// if enemy is over 32 in height, we need to subtract by
				// that much so it shows up on correct square
				const actualYPosition = actualEnemyY - (enemyData.imageData.height-32);
				return <ObjectWithHealth
					key={`enemy_${index}`}
					x={x + enemy.x * SQUARE_SIZE}
					y={y + actualYPosition}
					width={enemyData.imageData.width}
					height={enemyData.imageData.height}
					image={enemyData.imageData.image}
					hp={enemy.hp}
					maxHP={enemyData.maxHP}
				/>;
			})}
			{ this.props.activeLocations.map((location, index) => {
				return <Rect
					x={location.x * SQUARE_SIZE}
					y={location.y * SQUARE_SIZE}
					x2={(location.x + 1) * SQUARE_SIZE}
					y2={(location.y + 1) * SQUARE_SIZE}
					color="#0f0"
					fill={false}
				/>
			})}
		</Container>);
	}
}

Map.propTypes = propTypes;
Map.defaultProps = defaultProps;

export default Map;