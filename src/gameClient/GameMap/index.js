import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas, Text, Rect, Container } from '@bucky24/react-canvas';

import Map from '../../common/Map';
import Button from '../../common/Button';

import { saveMap } from '../../common/utils/saver';

import {
	getTiles,
	getCharacters,
	getWalkable,
	getObjects,
	getInactiveEnemies,
	getActiveEnemies,
	getMapMeta,
	inBattle
} from '../store/getters/map';
import {
	setCharacter,
	setObject,
	activateEnemy,
	harmEnemy,
	removeObject,
	setActiveCharacter,
} from '../store/ducks/map';
import {
	getEnemyData,
	getObjectData,
	getCharacterData
} from '../store/getters/gameData';
import {
	addGold,
	addEquipment
} from '../store/ducks/campaign';
import {
	getGold
} from '../store/getters/campaign';

import BattleHandler from '../EnemyHandler/battle';
import { handleTriggers } from '../Triggers/triggerHandler';

class GameMap extends Component {
	constructor(props) {
		super(props);
		
		this.moveActiveChar = this.moveActiveChar.bind(this);
		this.handleCollision = this.handleCollision.bind(this);
		this.nextCharacter = this.nextCharacter.bind(this);
	}
	activeCharacter() {
		const activeIndex = this.props.characters.findIndex((char) => {
			return char.selected;
		});
		const activeChar = this.props.characters[activeIndex];
		
		return {
			activeChar,
			activeIndex
		};
	}

	moveActiveChar(xOff, yOff) {
		const { activeChar, activeIndex } = this.activeCharacter();
		const newX = activeChar.x + xOff;
		const newY = activeChar.y + yOff;
		
		let canMove = true;
		let canAct = true;
		let totalPoints = 1;
		const fightPoints = 5;
		
		const key = `${newX}_${newY}`;
		
		if (!this.props.walkable.includes(key)) {
			return;
		}
		
		if (this.props.inBattle) {
			if (activeChar.actionPoints < totalPoints) {
				// no movement for you
				return;
			}
		}
		
		// check to see if we impacted an object
		const objectsCollided = this.props.objects.filter((object) => {
			return object.key === key;
		});
		
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
		
		const charactersCollided = this.props.characters.filter((object) => {
			const objKey = `${object.x}_${object.y}`;
			return objKey === key;
		});
		
		if (charactersCollided.length > 0) {
			canAct = false;
			canMove = false;
		}

		const enemiesCollided = this.props.activeEnemies.filter((enemy) => {
			const objKey = `${enemy.x}_${enemy.y}`;
			return objKey === key;
		});
		
		if (enemiesCollided.length > 0) {
			totalPoints = fightPoints;
			if (activeChar.actionPoints < totalPoints) {
				// no fight for you
				return;
			}
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
				y: newY,
			}, activeIndex);
			handleTriggers();
		}
		
		if (!this.props.inBattle) {
			totalPoints = 0;
		}
		
		if (canAct) {
			// get data again just in case
			const { activeChar, activeIndex } = this.activeCharacter();
			this.props.setCharacter({
				actionPoints: activeChar.actionPoints - totalPoints
			}, activeIndex);
			
			if (activeChar.actionPoints - totalPoints <= 0) {
				// no more movement. Switch to the next character
				this.nextCharacter();
			}
		}
	}
	
	handleItemCredit(itemList) {
		itemList.forEach((item) => {
			switch (item.type) {
			case "currency":
				// ignore the currency type for now
				this.props.addGold(item.data.amount);
				break;
			case "equipment":
				this.props.
				break;
			}
		})
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
					return enemy.doorTrigger === obj2.id;
				});
				
				if (enemiesToActivate.length > 0) {
					const enemyIDs = enemiesToActivate.forEach((enemy) => {
						this.props.activateEnemy(enemy.id);
					});
					
					// at this point reset the active player's action points
					this.resetActivePlayersActions();
				}
			}
		} else if (obj1.type === 'player' && obj2.type === 'enemy') {
			// hurt the enemy!
			this.props.harmEnemy(obj2.id, 5);
			
			return false;
		} else if (obj1.type === 'player' && obj2.type === 'chest') {
			this.props.removeObject(obj2.id);
			this.handleItemCredit(obj2.contains);
		}
		
		return true;
	}
	
	resetActivePlayersActions() {
		const { activeChar, activeIndex } = this.activeCharacter();
		const characterData = this.props.characterData[activeChar.ident];
		// reset the action points
		this.props.setCharacter({
			actionPoints: characterData.actionPoints
		}, activeIndex);
	}
	
	async nextCharacter() {
		let { activeIndex } = this.activeCharacter();
		this.resetActivePlayersActions();
		activeIndex ++;
		if (activeIndex >= this.props.characters.length) {
			activeIndex = 0;
			if (this.props.inBattle) {
				await BattleHandler();
			}
		}
		this.props.setActiveCharacter(activeIndex);
		// reset the action points for this new character just in case
		this.resetActivePlayersActions();
	}
	
	render() {
		const { activeChar } = this.activeCharacter();
		const activeCharData = activeChar ? this.props.characterData[activeChar.ident] : {};
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
					} else if (code === 'Enter') {
						this.nextCharacter();
					}
				}}
				enemyData={this.props.enemyData}
				objectData={this.props.objectData}
				characterData={this.props.characterData}
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
			<Button
				x={0}
				y={height-50}
				width={200}
				height={50}
				text="Save"
				onClick={() => {
					const gameObj = {
						activeEnemies: this.props.activeEnemies,
						inactiveEnemies: this.props.inactiveEnemies,
						objects: this.props.objects,
						characters: this.props.characters,
						map: this.props.mapMeta.activeMap,
						custom: this.props.mapMeta.customMap
					};
					saveMap('saveGame', gameObj);
				}}
			/>
			{ this.props.inBattle && <Container>
				<Rect
					x={width/2-100}
					y={height-50}
					x2={width/2+100}
					y2={height}
					color="#fff"
					fill={true}
				/>
				{ activeChar && <Container>
					<Text
						x={width/2-100}
						y={height-40}
					>
						Active character {activeChar.ident}
					</Text>
					<Text
						x={width/2-100}
						y={height-30}
					>
						Action points {activeChar.actionPoints}/{activeCharData.actionPoints}
					</Text>
				</Container>}
			</Container>}
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
		gold: getGold(state),
		objectData: getObjectData(state),
		mapMeta: getMapMeta(state),
		characterData: getCharacterData(state),
		inBattle: inBattle(state)
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
		},
		setActiveCharacter: (index) => {
			dispatch(setActiveCharacter(index));
		},
		addEquipment: (equipment) => {
			dispatch(addEquipment(equipment));
		}
 	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GameMap);