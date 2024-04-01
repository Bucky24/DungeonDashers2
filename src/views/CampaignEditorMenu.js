import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StandardMenu from '../components/StandardMenu';
import MenuOuter from '../components/MenuOuter';
import DialogBase from '../components/DialogBase';
import TextField from '../components/TextField';

export default function CampaignEditorMenu() {
    const navigate = useNavigate();
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [newCampaignName, setNewCampaignName] = useState("");

    return <MenuOuter>
        <StandardMenu
            items={["New Campaign", "Load Campaign", "Back"]}
            onSelect={(item) => {
                if (item === "Back") {
                    navigate("/editor");
                } else if (item === "New Campaign") {
                    setShowNewDialog(true);
                } else if (item === "Load Campaign") {
                    navigate("/editor/campaign/load");
                } else {
                    console.log(item);
                }
            }}
        />
        {showNewDialog && <DialogBase>
            <div>
                <div>New Campaign Name</div>
                <TextField value={newCampaignName} onBlur={setNewCampaignName} onEnter={(newName) => {
                    
                }} />
             </div>
        </DialogBase>}
    </MenuOuter>
}