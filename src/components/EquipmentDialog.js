import React, { useContext, useState } from 'react';

import DialogBase from './DialogBase';
import UIContext, { UI_MODE } from '../contexts/UIContext';
import GameContext from '../contexts/GameContext';

export default function EquipmentDialog() {
    const { setMode } = useContext(UIContext);
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
                                        {characters.map((character) => {
                                            return <option value={character.type}>{character.type}</option>
                                        })}
                                    </select>
                                    <button onClick={() => {
                                        const character = tempAssign[index];
                                        if (!character) {
                                            return;
                                        }
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