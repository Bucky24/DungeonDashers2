import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas, Text, Rect } from '@bucky24/react-canvas';
import Map from '../../common/Map';

import {
	getTiles,
	getCharacters,
	getWalkable,
	getObjects,
	getInactiveEnemies,
	getActiveEnemies
} from '../store/getters/map';
import {
	setCharacter,
	setObject,
	activateEnemy,
	harmEnemy,
	removeObject
} from '../store/ducks/map';
import {
	getEnemyData
} from '../store/getters/gameData';
import {
	addGold
} from '../store/ducks/campaign';
import {
	getGold
} from '../store/getters/campaign';

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
		} else if (obj1.type === 'player' && obj2.type === 'chest') {
			this.props.removeObject(obj2.id);
			this.props.addGold(obj2.amount)
		}
		
		return true;
	}
	render() {
		const { width, height } = this.props;
		return (<Canvas
			width={width}
			height={height}
		>
			<Map
				x={0}
				y={0}
				width={width}
				height={height}
				tiles={this.props.tiles}
				enemies={this.props.activeEnemies}
				objects={this.props.objects}
				characters={this.props.characters}
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
				enemyData={this.props.enemyData}
			/>
			<Rect
				x={0}
				y={0}
				x2={100}
				y2={14}
				color="#fff"
				fill={true}
			/>
			<Text
				x={0}
				y={12}
			>
				Gold: {this.props.gold}
			</Text>
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
		activeEnemies: getActiveEnemies(state),
		enemyData: getEnemyData(state),
		gold: getGold(state)
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
		},
		removeObject: (id) => {
			return dispatch(removeObject(id));
		},
		addGold: (amount) => {
			return dispatch(addGold(amount));
		}
 	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GameMap);