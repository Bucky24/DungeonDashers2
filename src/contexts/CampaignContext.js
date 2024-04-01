import React, { useContext, useEffect, useRef, useState } from 'react';

import Coms from '../utils/coms';
import ImageContext from './ImageContext';

const CampaignContext = React.createContext({});
export default CampaignContext;

export function CampaignProvider({ children }) {
    const [activeCampaign, setActiveCampaign] = useState(null);
    const [campaignData, setCampaignData] = useState(null);
    const campaignDataRef = useRef(null);
    const [loaded, setLoaded] = useState(true);
    const { loadImage } = useContext(ImageContext);
    const [activeSave, setActiveSave] = useState(null);

    useEffect(() => {
        if (activeCampaign) {
            Coms.send("loadCampaign", { campaign: activeCampaign }).then((data) => {
                const campaignData = data.campaign;
    
                campaignData.background.image = loadImage(campaignData.background.image);
    
                setCampaignData(campaignData);
                setLoaded(true);
            });

            Coms.send("loadSavedCampaign", { campaign: activeCampaign }).then((data) => {
                if (!data.success) {
                    setActiveSave(null);
                } else {
                    setActiveSave(data.data);
                }
            });
        }
    }, [activeCampaign]);

    useEffect(() => {
        campaignDataRef.current = campaignData;
    }, [campaignData]);

    const value = {
        loaded,
        activeCampaign,
        campaignData,
        campaignDataRef,
        campaignSaveData: activeSave,
        loadCampaign: (campaign) => {
            if (activeCampaign !== campaign) {
                setActiveCampaign(campaign);
                setLoaded(false);
            }
        },
        updateActiveCampaign: (key, value) => {
            setCampaignData((data) => {
                return {
                    ...data,
                    [key]: value,
                };
            });
        },
        saveCampaign: () => {
            Coms.send("saveCampaign", { name: activeCampaign, saveData: campaignData });
        },
        handleMapVictory: (map) => {
            if (!activeCampaign) {
                return;
            }

            const foundMap = campaignData.maps.find((data) => data.map === map);

            if (!foundMap) {
                return;
            }

            let saveData = activeSave;
            if (!activeSave) {
                saveData = {
                    maps: [],
                };
            }

            const existingMaps = saveData.maps.map((data) => data.map);
            if (existingMaps.includes(map)) {
                return;
            }

            saveData.maps.push({
                map,
            });

            Coms.send('updateCampaignSave', { campaign: activeCampaign, data: saveData });
        }
    };

    return <CampaignContext.Provider value={value}>
        {children}
    </CampaignContext.Provider>;
}