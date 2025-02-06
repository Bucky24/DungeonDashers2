import React, { useContext, useState } from 'react';

import DialogBase from './DialogBase';
import UIContext, { UI_MODE } from '../contexts/UIContext';
import GameContext from '../contexts/GameContext';
import ModuleContext from '../contexts/ModuleContext';

export default function EquipmentDialog() {
    const { setMode } = useContext(UIContext);
    const { characters: characterData, equipment: equipmentData } = useContext(ModuleContext);
    const { gameEquipment, characters, assignEquipmentToCharacter } = useContext(GameContext);
    const [tempAssign, setTempAssign] = useState({});

    const assignedEquipment = [];
    characters.map((character) => {
        for (const slot of character.slots) {
            assignedEquipment.push({
                ...slot,
                character: character.type,
            });
        }
    });

    return <DialogBase onClose={() => {
        setMode(UI_MODE.GAME);
    }}>
        <div>
            <div>
                Unassigned equipment
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Assign</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gameEquipment.map((equipment, index) => {
                            return <tr>
                                <td>{equipment.type}</td>
                                <td>
                                    <select onChange={(e) => {
                                        setTempAssign({
                                            ...tempAssign,
                                            [index]: e.target.value,
                                        });
                                    }}>
                                        <option value=''>None</option>
                                        {characters.map((character) => {
                                            return <option value={character.type}>{character.type}</option>
                                        })}
                                    </select>
                                    <button onClick={() => {
                                        const character = tempAssign[index];
                                        if (!character) {
                                            return;
                                        }

                                        const characterInfo = characterData[character];
                                        const equipmentInfo = equipmentData[equipment.type];
                                        const gameCharacter = characters.find((char) => {
                                            return char.type === character;
                                        });

                                        const equippedSlots = (gameCharacter.slots || []).map(item => item.slot);
                                        const validSlots = [];
                                        for (const characterSlot of characterInfo.slots) {
                                            if (characterSlot.type === equipmentInfo.slot && !equippedSlots.includes(equipment.slot)) {
                                                validSlots.push(equipmentInfo.slot);
                                            }
                                        }

                                        if (validSlots.length === 0) return;
                                        const slot = validSlots[0];

                                        assignEquipmentToCharacter(character, equipment.type, slot);
                                    }}>
                                        Assign
                                    </button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div>
                Assigned equipment
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Assigned To</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedEquipment.map((equipment) => {
                            return <tr>
                                <td>{equipment.type}</td>
                                <td>{equipment.character}</td>
                                <td>
                                    <button>Remove</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </DialogBase>
}