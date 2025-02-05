import React, { useContext, useState } from 'react';

import DialogBase from './DialogBase';
import UIContext, { UI_MODE } from '../contexts/UIContext';
import GameContext from '../contexts/GameContext';
import ModuleContext from '../contexts/ModuleContext';

export default function EquipmentDialog() {
    const { setMode } = useContext(UIContext);
    const { characters: characterData, equipment: equipmentData } = useContext(ModuleContext);
    const { gameEquipment, characters } = useContext(GameContext);
    const [tempAssign, setTempAssign] = useState({});

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

                                        console.log(characterInfo, equipmentInfo);
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
            </div>
        </div>
    </DialogBase>
}