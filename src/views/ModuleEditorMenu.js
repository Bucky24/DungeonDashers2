import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StandardMenu from '../components/StandardMenu';
import MenuOuter from '../components/MenuOuter';
import DialogBase from '../components/DialogBase';
import TextField from '../components/TextField';

export default function ModuleEditorMenu() {
    const navigate = useNavigate();
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [newModuleName, setNewModuleName] = useState("");

    return <MenuOuter>
        <StandardMenu
            items={["New Module", "Load Module", "Back"]}
            onSelect={(item) => {
                if (item === "Back") {
                    navigate("/editor");
                } else if (item === "New Module") {
                    setShowNewDialog(true);
                } else if (item === "Load Module") {
                    navigate("/editor/module/load");
                } else {
                    console.log(item);
                }
            }}
        />
        {showNewDialog && <DialogBase>
            <div>
                <div>New Module Name</div>
                <TextField value={newModuleName} onBlur={setNewModuleName} onEnter={(newName) => {
                    if (newName === "") {
                        setShowNewDialog(false);
                    } else {
                        navigate(`/editor/module/new/${newName}`);
                    }
                }} />
             </div>
        </DialogBase>}
    </MenuOuter>
}