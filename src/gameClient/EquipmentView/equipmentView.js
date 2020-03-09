import React from 'react';
import { Canvas, Text, Container, Rect } from '@bucky24/react-canvas';
import { connect } from 'react-redux';

import Button from '../../common/Button';
import { Panes, setUIPane } from '../store/ducks/ui';
import { getUnassignedEquipment } from '../store/getters/campaign';
import { getCharacters } from '../store/getters/map';
import { setCharacter } from '../store/ducks/map';
import { removeEquipment, addEquipment } from '../store/ducks/campaign';

class EquipmentView extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			activeCharacterIndex: 0
		};
	}
	render() {
		const {
			width,
			height,
			setPane,
			unassignedEquipment,
			characters,
			setCharacter,
			removeEquipment,
			addEquipment,
		} = this.props;
		
		const activeCharacter = characters[this.state.activeCharacterIndex];

		return <Canvas
			width={width}
			height={height}
		>
			<Rect
				x={0}
				y={0}
				x2={width}
				y2={height}
				color="#fff"
				fill={true}
			/>
			<Button
				x={0}
				y={0}
				width={200}
				height={50}
				text="Back to Game"
				onClick={() => {
					setPane(Panes.GAME);
				}}
			/>
			<Text
				x={0}
				y={70}
				color="#000"
			>
				Unassigned Equipment
			</Text>
			{ unassignedEquipment.map((equipment, index) => {
				const y = 90 + 40 * index
				return <Container key={index}>
					<Text x={0} y={y+12}>
						{ equipment.type }
					</Text>
					<Button
						x={100}
						y={y}
						text="Equip"
						width={100}
						height={30}
						onClick={() => {
							// update equipment on character
							setCharacter({
								equipment: [
									...activeCharacter.equipment,
									equipment,
								],
							}, this.state.activeCharacterIndex);
							// remove from pool
							removeEquipment(index);
						}}
					/>
				</Container>;
			})}
			<Container>
				<Text x={400} y={60}>
					{ activeCharacter.ident } equipment
				</Text>
				{ activeCharacter.equipment.map((equipment, index) => {
					const y = 90 + 40 * index
					return <Container key={index}>
						<Text x={400} y={y+12}>
							{ equipment.type }
						</Text>
						<Button
							x={500}
							y={y}
							text="Unequip"
							width={100}
							height={30}
							onClick={() => {
								addEquipment(equipment);
								setCharacter({
									equipment: activeCharacter.equipment.filter((item, itemIndex) => {
										return itemIndex !== index;
									}),
								}, this.state.activeCharacterIndex);
							}}
						/>
					</Container>;
				})}
			</Container>
			<Button
				x={400}
				y={0}
				width={100}
				height={50}
				text="Prev Character"
				onClick={() => {
					let newActive = this.state.activeCharacterIndex - 1;
					if (newActive < 0) {
						newActive = characters.length-1;
					}
					this.setState({
						activeCharacterIndex: newActive,
					});
				}}
			/>
			<Button
				x={510}
				y={0}
				width={100}
				height={50}
				text="Next Character"
				onClick={() => {
					let newActive = this.state.activeCharacterIndex + 1;
					if (newActive >= characters.length) {
						newActive = 0;
					}
					this.setState({
						activeCharacterIndex: newActive,
					});
				}}
			/>
		</Canvas>;
	}
}

const mapStateToProps = (state) => {
	return {
		unassignedEquipment: getUnassignedEquipment(state),
		characters: getCharacters(state),
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setPane: (pane) => {
			dispatch(setUIPane(pane));
		},
		setCharacter: (data, index) => {
			dispatch(setCharacter(data, index));
		},
		removeEquipment: (index) => {
			dispatch(removeEquipment(index));
		},
		addEquipment: (data) => {
			dispatch(addEquipment(data));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentView);
