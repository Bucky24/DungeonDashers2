import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Canvas, Text, Rect, Container } from '@bucky24/react-canvas';

import Map from '../../common/Map';
import Button from '../../common/Button';
import Dialog from '../Dialog';
import LostGame from '../LostGame';

import { saveMap } from '../../common/utils/saver';
import { executeScriptAsCharacter } from "../scriptHandler/scriptHandler";

import {
	getTiles,
	getCharacters,
	getWalkable,
	getObjects,
	getInactiveEnemies,
	getActiveEnemies,
	getMapMeta,
	inBattle,
	getPause,
	getCameraCenter,
	getDialog,
	getLivingCharacterCount,
	getLivingCharacters,
} from '../store/getters/map';
import {
	setCharacter,
	setObject,
	activateEnemy,
	harmEnemy,
	removeObject,
	setActiveCharacter,
	setEnemyActionPoints,
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
import { Panes, setUIPane, setChooseLoc } from '../store/ducks/ui';
import { getChooseLoc } from '../store/getters/ui';

import BattleHandler from '../EnemyHandler/battle';
import { handleTriggers } from '../Triggers/triggerHandler';
import { STRAIGHT_LINES, POINTS_FOR_ATTACK, POINTS_FOR_MOVE } from '../scriptHandler/constants';
import { fireEvent } from "../eventEmitter/emitter";

class GameMap extends Component {
	constructor(props) {
		super(props);
		
		this.moveActiveChar = this.moveActiveChar.bind(this);
		this.handleCollision = this.handleCollision.bind(this);
		this.nextCharacter = this.nextCharacter.bind(this);
		this.updating = false;

		this.state = {
			updating: false,
		};
	}
	activeCharacter() {
		const activeIndex = this.props.characters.findIndex((char) => {
			return char.selected;
		});

		if (activeIndex === -1) {
			return {};
		}

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
		let totalPoints = POINTS_FOR_MOVE;
		
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
		
		const charactersCollided = this.props.livingCharacters.filter((object) => {
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
			totalPoints = POINTS_FOR_ATTACK;
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
		if (!itemList) {
			return;
		}
		itemList.forEach((item) => {
			switch (item.type) {
			case "currency":
				// ignore the currency type for now
				this.props.addGold(item.data.amount);
				break;
			case "equipment":
				this.props.addEquipment(item.data);
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
				if (obj2.switchTrigger) {
					// can't open this door
					return false;
				}
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

			return true;
		} else if (obj1.type === 'player' && obj2.type === 'enemy') {
			// hurt the enemy!
			this.props.harmEnemy(obj2.id, 5);
		} else if (obj1.type === 'player' && obj2.type === 'chest') {
			this.props.removeObject(obj2.id);
			this.handleItemCredit(obj2.contains);

			return true;
		} else if (obj1.type === "player" && obj2.type === "trigger") {
			return true;
		} else if (obj1.type === "player" && obj2.type === "switch") {
			if (!obj2.isActive) {
				this.props.setObject(obj2.id, {
					isActive: true
				});
				// find all enemies that should be activated by this door
				const objectsToActivate = this.props.objects.filter((obj) => {
					return obj.switchTrigger === obj2.id;
				});
				
				if (objectsToActivate.length > 0) {
					for (const obj of objectsToActivate) {
						if (obj.type === "door") {
							this.props.setObject(obj.id, {
								isOpen: true,
							});
						}
					}
				}
			}
		} else if (obj1.type === 'player' && obj2.type === 'portal') {
			return true;
		}
		
		return false;
	}
	
	resetActivePlayersActions() {
		const { activeChar, activeIndex } = this.activeCharacter();
		const characterData = this.props.characterData[activeChar.ident];
		// reset the action points
		this.props.setCharacter({
			actionPoints: characterData.actionPoints
		}, activeIndex);
	}

	resetActiveEnemyActions() {
		const { activeEnemies } = this.props;

		activeEnemies.forEach((enemy) => {		
			const enemyData = this.props.enemyData[enemy.type];
			this.props.setEnemyActionPoints(enemy.id, enemyData.actionPoints);
		});
	}
	
	async nextCharacter() {
		if (this.state.updating) {
			return false;
		}
		this.setState({
			updating: true,
		});
		try {
			let { activeIndex } = this.activeCharacter();
			this.resetActivePlayersActions();

			const getNextActiveIndex = (currentIndex) => {
				for (let i=currentIndex+1;i<this.props.characters.length;i++) {
					const character = this.props.characters[i];
					if (!character.dead) {
						return i;
					}
				}

				return -1;
			}

			let newIndex = getNextActiveIndex(activeIndex);
			let forceUpdate = false;
			if (newIndex < 0) {
				if (this.props.inBattle) {
					await BattleHandler();
					forceUpdate = true;
				}
				this.resetActiveEnemyActions();
				// -1 because then the loop will start at 0
				newIndex = getNextActiveIndex(-1);
			}
			// if this is -1 still there are no characters left alive, and the game should
			// go to the close screen. In fact the state probably has already updated but...
			if (newIndex >= 0) {
				this.props.setActiveCharacter(newIndex);
				// reset the action points for this new character just in case
				this.resetActivePlayersActions();
				if (forceUpdate) {
					this.forceUpdate();
				}
			}
		} catch (e) {
			console.error(e);
		}

		this.setState({
			updating: false,
		});
	}
	
	render() {
		const { activeChar } = this.activeCharacter();
		const activeCharData = activeChar ? this.props.characterData[activeChar.ident] : {};
		const { width, height, setPane, chooseLoc, pause } = this.props;
		
		const choosing = chooseLoc.choosing;
		
		let activeLocations = [];
		
		if (choosing) {
			const locations = [];
			switch (chooseLoc.type) {
			case STRAIGHT_LINES:
				for (let i=chooseLoc.startX + chooseLoc.min;i<=chooseLoc.startX + chooseLoc.max;i++) {
					const location = {
						x: i,
						y: chooseLoc.startY,
					};
					locations.push(location);
				}
				for (let i=chooseLoc.startX - chooseLoc.min;i>=chooseLoc.startX - chooseLoc.max;i--) {
					const location = {
						x: i,
						y: chooseLoc.startY,
					};
					locations.push(location);
				}
				for (let i=chooseLoc.startY + chooseLoc.min;i<=chooseLoc.startY + chooseLoc.max;i++) {
					const location = {
						x: chooseLoc.startX,
						y: i,
					};
					locations.push(location);
				}
				for (let i=chooseLoc.startY - chooseLoc.min;i>=chooseLoc.startY - chooseLoc.max;i--) {
					const location = {
						x: chooseLoc.startX,
						y: i,
					};
					locations.push(location);
				}
				
				break;
			}
			
			activeLocations = locations.filter(({ x, y }) => {
				return true;
			});
		}

		if (this.props.livingCharacterCount === 0) {
			return <LostGame width={this.props.width} height={this.props.height} />;
		}
		
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
				characters={this.props.livingCharacters}
				activeLocations={activeLocations}
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
					} else if (code === "KeyQ") {
						if (activeCharData.special) {
							executeScriptAsCharacter(activeCharData.special, activeChar.ident);
						}
					}
				}}
				enemyData={this.props.enemyData}
				objectData={this.props.objectData}
				characterData={this.props.characterData}
				onClick={(x, y, button ) => {
					if (this.props.dialog || pause) {
						return;
					}
					const location = activeLocations.find((loc) => {
						return loc.x === x && loc.y === y;
					});

					if (location) {
						fireEvent("locationClicked", location);
						this.props.setChooseLoc(false);
					}
				}}
				cameraCenter={this.props.cameraCenter}
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
			<Button
				x={210}
				y={height-50}
				width={200}
				height={50}
				text="Equipment"
				onClick={() => {
					setPane(Panes.GAME_EQUIPMENT);
				}}
			/>
			{ pause && <Text
				x={100}
				y={12}
				color="#f00"
			>Paused</Text> }
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
			{ this.props.dialog && <Dialog
				text={this.props.dialog.text}
				characterIdent={this.props.dialog.characterIdent}
				characterData={this.props.characterData}
				x={width/2-200}
				y={height-170}
				width={400}
				height={100}
			/>}
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
		inBattle: inBattle(state),
		chooseLoc: getChooseLoc(state),
		pause: getPause(state),
		cameraCenter: getCameraCenter(state),
		dialog: getDialog(state),
		livingCharacters: getLivingCharacters(state),
		livingCharacterCount: getLivingCharacterCount(state),
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setPane: (pane) => {
			dispatch(setUIPane(pane));
		},
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
		},
		setChooseLoc: (choosing, min, max, type, startX, startY) => {
			dispatch(setChooseLoc(choosing, min, max, type, startX, startY));
		},
		setEnemyActionPoints: (id, actionPoints) => {
			return dispatch(setEnemyActionPoints(id, actionPoints));
		}
 	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GameMap);