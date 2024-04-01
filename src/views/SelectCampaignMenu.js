import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StandardMenu from '../components/StandardMenu';
import MenuOuter from '../components/MenuOuter';
import Coms from '../utils/coms';

export default function SelectCampaignMenu() {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        Coms.send("getCampaignNames").then((data) => {
            setCampaigns(data.campaigns);
        });
    }, []);

    return <MenuOuter>
        <StandardMenu
            items={[...campaigns, "Back"]}
            onSelect={(item) => {
                if (item === "Back") {
                    navigate("/");
                } else {
                    navigate(`/campaign/${item}`);
                }
            }}
        />
    </MenuOuter>
}