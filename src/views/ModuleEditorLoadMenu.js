import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StandardMenu from '../components/StandardMenu';
import MenuOuter from '../components/MenuOuter';
import Coms from '../utils/coms';

export default function ModuleEditorLoadMenu() {
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);

    useEffect(() => {
        Coms.send("getModuleNames").then((data) => {
            if (data.success) {
                setModules(data.modules);
            }
        });
    }, []);

    return <MenuOuter>
        <StandardMenu
            items={[...modules, "Back"]}
            onSelect={(item) => {
                if (item === "Back") {
                    navigate("/editor/module");
                } else {
                    navigate(`/editor/module/${item}`);
                }
            }}
        />
    </MenuOuter>
}