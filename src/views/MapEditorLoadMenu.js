import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StandardMenu from '../components/StandardMenu';
import MenuOuter from '../components/MenuOuter';
import Coms from '../utils/coms';

export default function MapEditorLoadMenu() {
    const navigate = useNavigate();
    const [maps, setMaps] = useState([]);

    useEffect(() => {
        Coms.send("getMapNames").then((data) => {
            setMaps(data.maps);
        });
    }, []);

    return <MenuOuter>
        <StandardMenu
            items={[...maps, "Back"]}
            onSelect={(item) => {
                if (item === "Back") {
                    navigate("/editor/map");
                } else {
                    navigate(`/editor/map/${item}`);
                }
            }}
        />
    </MenuOuter>
}