import React, { useContext } from 'react';
import GameContext from '../contexts/GameContext';

export default function GameHud() {
    const { gold } = useContext(GameContext);

    return <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: "#fff",
        display: 'flex',
    }}>Gold: {gold}</div>
}