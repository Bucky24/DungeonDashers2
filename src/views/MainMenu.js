import React from 'react';
import { useNavigate } from 'react-router-dom';

import StandardMenu from '../components/StandardMenu';
import MenuOuter from '../components/MenuOuter';

export default function MainMenu() {
    const navigate = useNavigate();

    return <MenuOuter>
        <StandardMenu
            items={["New Game", "Load Game", "Editors", "Settings", "Exit Game"]}
            onSelect={(item) => {
                if (item === "Editors") {
                    navigate("/editor");
                } else if (item === "Load Game") {
                    navigate("/game/load");
                } else {
                    console.log(item);
                }
            }}
        />
    </MenuOuter>;
}