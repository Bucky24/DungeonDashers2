import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas, Shape, Image } from '@bucky24/react-canvas';
import Door from '../Door';
import ObjectWithHealth from '../ObjectWithHealth';

import {
	getTiles,
	getCharacters,
	getWalkable,
	getObjects,
	getInactiveEnemies,
	getActiveEnemies
} from '../store/getters/game';
import {
	setCharacter,
	setObject,
	activateEnemy,
	harmEnemy
} from '../store/ducks/game';

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
		
		// check to see if we impacted an object
		const objectsCollided = this.props.objects.filter((object) => {
			return object.key === key;
		});
		
		let canMove = true;
		if (objectsCollided.length > 0) {
			for (let i=0;i<objectsCollided.length;i++) {
				const allowMovement = this.handleCollision({
					type: 'player',
					index: activeIndex
				}, objectsCollided[i]);
				if (!allowMovement) {
					canMove = false;
				}
			}
		}
		
		const enemiesCollided = this.props.activeEnemies.filter((enemy) => {
			const objKey = `${enemy.x}_${enemy.y}`;
			return objKey === key;
		});
		
		if (enemiesCollided.length > 0) {
			for (let i=0;i<enemiesCollided.length;i++) {
				const enemy = {
					type: 'enemy',
					enemyType: enemiesCollided[i].type,
					id: enemiesCollided[i].id
				}
				const allowMovement = this.handleCollision({
					type: 'player',
					index: activeIndex
				}, enemy);
				if (!allowMovement) {
					canMove = false;
				}
			}
		}
		
		if (canMove) {
			this.props.setCharacter({
				x: newX,
				y: newY
			}, activeIndex);
		}
	}
	
	// returns false if player cannot move there
	handleCollision(obj1, obj2) {
		// simple for now, more complex later
		if (obj1.type === 'player' && obj2.type === 'door') {
			// open the door
			if (!obj2.isOpen) {
				this.props.setObject(obj2.id, {
					isOpen: true
				});
				// find all enemies that should be activated by this door
				const enemiesToActivate = this.props.inactiveEnemies.filter((enemy) => {
					return enemy.trigger === obj2.id;
				});
				
				if (enemiesToActivate.length > 0) {
					const enemyIDs = enemiesToActivate.forEach((enemy) => {
						this.props.activateEnemy(enemy.id);
					});
				}
			}
		} else if (obj1.type === 'player' && obj2.type === 'enemy') {
			// hurt the enemy!
			this.props.harmEnemy(obj2.id, 5);
			
			return false;
		}
		
		return true;
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
				return <ObjectWithHealth
					x={characterPos.x}
					y={drawPosition}
					width={32}
					height={96}
					image={image}
					hp={1}
					maxHP={1}
				/>;
			})}
			{ this.props.activeEnemies.map((enemy) => {
				const imageData = enemyList[enemy.type];
				return <ObjectWithHealth
					x={enemy.x}
					y={enemy.y}
					width={32}
					height={imageData.height}
					image={imageData.image}
					hp={enemy.hp}
					maxHP={10}
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
		objects: getObjects(state),
		inactiveEnemies: getInactiveEnemies(state),
		activeEnemies: getActiveEnemies(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setCharacter: (data, index) => {
			return dispatch(setCharacter(data, index));
		},
		setObject: (id, data) => {
			return dispatch(setObject(id, data));
		},
		activateEnemy: (id) => {
			return dispatch(activateEnemy(id));
		},
		harmEnemy: (id, amount) => {
			return dispatch(harmEnemy(id, amount));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GameMap);