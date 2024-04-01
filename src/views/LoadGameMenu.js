import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StandardMenu from '../components/StandardMenu';
import MenuOuter from '../components/MenuOuter';
import Coms from '../utils/coms';

export default function LoadGameMenu() {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);

    useEffect(() => {
        Coms.send("getSavedGames").then((data) => {
            setGames(data.games);
        });
    }, []);

    return <MenuOuter>
        <StandardMenu
            items={[...games, "Back"]}
            onSelect={(item) => {
                if (item === "Back") {
                    navigate("/");
                } else {
                    navigate(`/game/load/${item}`);
                }
            }}
        />
    </MenuOuter>
}