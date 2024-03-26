import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GameContext from '../contexts/GameContext';
import Game from './Game';

export default function NewGame() {
    const { game } = useParams();
    const { loadGame } = useContext(GameContext);

    useEffect(() => {
        loadGame(game);
    }, [game]);

    return <Game />
}