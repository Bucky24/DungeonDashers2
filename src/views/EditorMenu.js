import React from 'react';
import { useNavigate } from 'react-router-dom';

import StandardMenu from '../components/StandardMenu';
import MenuOuter from '../components/MenuOuter';

export default function EditorMenu() {
    const navigate = useNavigate();

    return <MenuOuter>
        <StandardMenu
            items={["Map Editor", "Module Editor", 'Campaign Editor', "Back"]}
            onSelect={(item) => {
                if (item === "Back") {
                    navigate("/");
                } else if (item === "Map Editor") {
                    navigate('/editor/map');
                } else if (item === 'Campaign Editor') {
                    navigate('/editor/campaign');
                } else {
                    console.log(item);
                }
            }}
        />
    </MenuOuter>
}