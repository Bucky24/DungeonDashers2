import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GameContext from '../contexts/GameContext';
import Game from './Game';
import CampaignContext from '../contexts/CampaignContext';

export default function NewGame() {
    const { map, campaign } = useParams();
    const { newGame } = useContext(GameContext);
    const { loadCampaign } = useContext(CampaignContext);
    
    useEffect(() => {
        newGame(map);
    }, [map]);

    useEffect(() => {
        if (campaign) {
            loadCampaign(campaign);
        }
    }, [campaign]);

    return <Game />
}