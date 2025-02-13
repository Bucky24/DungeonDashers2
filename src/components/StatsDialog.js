import React, { useContext, useState } from 'react';

import DialogBase from './DialogBase';
import UIContext, { UI_MODE } from '../contexts/UIContext';
import GameContext from '../contexts/GameContext';
import ModuleContext from '../contexts/ModuleContext';
import { getActionPoints, getHp, getMaxActionPoints, getMaxHp } from '../data/attributeHelper';

export default function StatsContext() {
    const { setMode } = useContext(UIContext);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const { characters } = useContext(GameContext);
    const { characters: characterData } = useContext(ModuleContext);
    
    const activeCharacter = characters.find((character) => character.type === selectedCharacter);
    const activeCharacterData = activeCharacter ? characterData[selectedCharacter] : null;

    return <DialogBase onClose={() => {
        setMode(UI_MODE.GAME);
    }}>
        <div style={{ display: 'flex', minHeight: 300, maxWidth: '50vw', width: '100vw' }}>
            <div style={{ flexBasis: 200, flexShrink: 0, paddingRight: 20 }}>
                {characters.map((character) => {
                    const data = characterData[character.type];
                    return <div
                        key={character.type}
                        style={{
                            outline: selectedCharacter === character.type ? '1px solid red' : null,
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            setSelectedCharacter(character.type);
                        }}
                    >
                        {data.name}
                    </div>
                })}
            </div>
            <div style={{ flexGrow: 1 }}>
                {activeCharacter && <div>
                    <div>Name: {activeCharacterData.name}</div>
                    <div>Current HP: {getHp(activeCharacter)}/{getMaxHp(activeCharacter)}</div>
                    <div>Action Points: {getActionPoints(activeCharacter)}/{getMaxActionPoints(activeCharacter)}</div>
                </div>}
            </div>
        </div>
    </DialogBase>
}