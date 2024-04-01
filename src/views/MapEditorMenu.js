import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StandardMenu from '../components/StandardMenu';
import MenuOuter from '../components/MenuOuter';
import DialogBase from '../components/DialogBase';
import TextField from '../components/TextField';

export default function MapEditorMenu() {
    const navigate = useNavigate();
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [newMapName, setNewMapName] = useState("");

    return <MenuOuter>
        <StandardMenu
            items={["New Map", "Load Map", "Back"]}
            onSelect={(item) => {
                if (item === "Back") {
                    navigate("/editor");
                } else if (item === "New Map") {
                    setShowNewDialog(true);
                } else if (item === "Load Map") {
                    navigate("/editor/map/load");
                } else {
                    console.log(item);
                }
            }}
        />
        {showNewDialog && <DialogBase>
            <div>
                <div>New Map Name</div>
                <TextField value={newMapName} onBlur={setNewMapName} onEnter={(newName) => {
                    if (newName === "") {
                        setShowNewDialog(false);
                    } else {
                        navigate(`/editor/map/new/${newName}`);
                    }
                }} />
             </div>
        </DialogBase>}
    </MenuOuter>
}