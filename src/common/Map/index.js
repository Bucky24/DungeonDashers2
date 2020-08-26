import React from 'react';
import PropTypes from 'prop-types';
import { Shape, Image, CanvasComponent, Container, Canvas, Rect } from '@bucky24/react-canvas';
import Door from '../Door';
import ObjectWithHealth from '../ObjectWithHealth';
import Object from '../Object';

import tileMap from '../tileMap';

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
			const { xOff, yOff } = this.getOffCoords();
        	const squareX = Math.floor((x - this.props.x - xOff)/SQUARE_SIZE);
			const squareY = Math.floor((y - this.props.y - yOff)/SQUARE_SIZE);
			this.props.onClick(squareX, squareY, button);
        }
	}
	
	getOffCoords() {
		const activeCharacter = this.props.characters.find((char) => {
			return char.selected;
		});

		let xOff = 0;
		let yOff = 0;

		if (activeCharacter) {
			const centerX = this.props.x + this.props.width/2;
			const centerY = this.props.y + this.props.height/2;

			const charX = activeCharacter.x*SQUARE_SIZE;
			const charY = activeCharacter.y*SQUARE_SIZE;

			xOff = centerX - charX;
			yOff = centerY - charY;
		}

		const xOffCell = Math.round(xOff/SQUARE_SIZE);
		const yOffCell = Math.round(yOff/SQUARE_SIZE);

		return {
			xOff,
			yOff,
			xOffCell,
			yOffCell,
		};
	}

	render() {
		const { x, y, width, height } = this.props;

		const { xOff, yOff, xOffCell, yOffCell } = this.getOffCoords();

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
				color="#191919"
				fill={true}
			/>
			{ this.props.tiles.map((tile, index) => {
				return <Image
					key={`tile_${index}`}
					x={x+ tile.x * 32 + xOff}
					y={y+ tile.y * 32 + yOff}
					width={32}
					height={32}
					src={tileMap[tile.tile]}
				/>;
			})}
			{ this.props.objects.map((object, index) => {
				const data = this.props.objectData[object.type];
				const xCoordCell = x/SQUARE_SIZE + object.x + xOffCell;
				const xCoord = x + object.x * SQUARE_SIZE + xOff;
				const yCoordCell = y/SQUARE_SIZE + object.y + yOffCell;
				const yCoord = y + object.y * SQUARE_SIZE + yOff;
				if (object.type === 'door') {
					return <Door
						key={`object_${index}`}
						x={xCoordCell}
						y={yCoordCell}
						isOpen={object.isOpen}
						image={data.imageData.image}
					/>
				} else {
					return <Object
						key={`object_${index}`}
						x={xCoord}
						y={yCoord}
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
					x={x + characterObj.x*SQUARE_SIZE + xOff}
					y={y + drawPosition*SQUARE_SIZE + yOff}
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
				const actualEnemyY = enemy.y * SQUARE_SIZE + yOff;
				// if enemy is over 32 in height, we need to subtract by
				// that much so it shows up on correct square
				const actualYPosition = actualEnemyY - (enemyData.imageData.height-32);
				return <ObjectWithHealth
					key={`enemy_${index}`}
					x={x + enemy.x * SQUARE_SIZE + xOff}
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
					x={location.x * SQUARE_SIZE + xOff}
					y={location.y * SQUARE_SIZE + yOff}
					x2={(location.x + 1) * SQUARE_SIZE + xOff}
					y2={(location.y + 1) * SQUARE_SIZE + yOff}
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