import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GameContext from '../contexts/GameContext';
import Game from './Game';

export default function NewGame() {
    const { map } = useParams();
    const { newGame } = useContext(GameContext);

    useEffect(() => {
        newGame(map);
    }, [map]);

    return <Game />
}