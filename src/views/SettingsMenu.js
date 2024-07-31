import React from 'react';
import { useNavigate } from 'react-router-dom';

import StandardMenu from '../components/StandardMenu';
import MenuOuter from '../components/MenuOuter';

export default function SettingsMenu() {
    const navigate = useNavigate();

    return <MenuOuter>
        <StandardMenu
            items={["Controls", "Back"]}
            onSelect={(item) => {
                if (item === "Back") {
                    navigate("/");
                } else if (item === "Controls") {
                    navigate("/settings/controls");
                }
            }}
        />
    </MenuOuter>
}