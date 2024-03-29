import React, { useContext, useEffect, useState } from 'react';

import Coms from '../utils/coms';
import ImageContext from './ImageContext';

const CampaignContext = React.createContext({});
export default CampaignContext;

export function CampaignProvider({ children }) {
    const [activeCampaign, setActiveCampaign] = useState(null);
    const [campaignData, setCampaignData] = useState(null);
    const [loaded, setLoaded] = useState(true);
    const { loadImage } = useContext(ImageContext);

    useEffect(() => {
        if (activeCampaign) {
            Coms.send("loadCampaign", { campaign: activeCampaign }).then((data) => {
                const campaignData = data.campaign;
    
                campaignData.background.image = loadImage(campaignData.background.image);
    
                setCampaignData(campaignData);
                setLoaded(true);
            });
        }
    }, [activeCampaign]);

    const value = {
        loaded,
        activeCampaign,
        campaignData,
        loadCampaign: (campaign) => {
            if (activeCampaign !== campaign) {
                setActiveCampaign(campaign);
                setLoaded(false);
            }
        }
    };

    return <CampaignContext.Provider value={value}>
        {children}
    </CampaignContext.Provider>;
}