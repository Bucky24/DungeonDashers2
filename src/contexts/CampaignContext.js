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
    const [campaignEquipment, setCampaignEquipment] = useState([]);
    const [campaignCharacters, setCampaignCharacters] = useState([]);

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
                    setCampaignEquipment([]);
                    setCampaignCharacters([]);
                } else {
                    setActiveSave(data.data);
                    setCampaignEquipment(data.data.equipment || []);
                    setCampaignCharacters(data.data.characters || []);
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
        campaignEquipment,
        campaignCharacters,
        loadCampaign: (campaign) => {
            if (!campaign) {
                setLoaded(true);
                return;
            }
            if (activeCampaign !== campaign) {
                setActiveCampaign(campaign);
                setLoaded(false);
            } else {
                setLoaded(true);
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
                    type: 'campaign',
                    maps: [],
                };
            }

            saveData.equipment = campaignEquipment;
            saveData.characters = campaignCharacters;

            const existingMaps = saveData.maps.map((data) => data.map);
            if (existingMaps.includes(map)) {
                return;
            }

            saveData.maps.push({
                map,
            });

            Coms.send('updateCampaignSave', { campaign: activeCampaign, data: saveData });
        },
        saveCampaignSave: () => {
            if (!activeCampaign) {
                return;
            }

            let saveData = activeSave;
            if (!activeSave) {
                saveData = {
                    type: 'campaign',
                    maps: [],
                };
            }

            saveData.equipment = campaignEquipment;
            saveData.characters = campaignCharacters;

            Coms.send('updateCampaignSave', { campaign: activeCampaign, data: saveData });
        },
        setCampaignEquipment: (equipment) => {
            if (!equipment) {
                equipment = [];
            }
            setCampaignEquipment(equipment);
        },
        addCampaignEquipment: (type) => {
            setCampaignEquipment((equipment) => {
                return [...equipment, { type }];
            });
        },
        assignCampaignEquipment: (characterType, equipmentType, slot) => {
            setCampaignCharacters((entities) => {
                const newEntities = [...entities];
                let found = false;
                for (const char of newEntities) {
                    if (char.type === characterType) {
                        found = true;
                        const newSlots = char.slots || [];
                        newSlots.push({
                            type: equipmentType,
                            slot,
                        });
                        break;
                    }
                }

                if (!found) {
                    newEntities.push({
                        type: characterType,
                        slots: [{
                            type: equipmentType,
                            slot,
                        }],
                    });
                }

                return newEntities;
            });
            setCampaignEquipment((equipments) => {
                const firstIndex = equipments.findIndex(item => item.type === equipmentType);
                console.log(equipments, equipmentType, firstIndex);
                const newEquipment = [...equipments];
                newEquipment.splice(firstIndex, 1);
                return newEquipment;
            });
        },
        removeCampaignEquipment: (characterType, equipmentType) => {
            setCampaignCharacters((entities) => {
                const newEntities = [...entities];
                for (const char of newEntities) {
                    if (char.type === characterType) {
                        const newSlots = [...char.slots] || [];
                        const firstIndex = newSlots.findIndex(item => item.type === equipmentType);
                        newSlots.splice(firstIndex, 1);
                        char.slots = newSlots;
                        break;
                    }
                }

                return newEntities;
            });
            setCampaignEquipment((equipments) => {
                const newEquipment = [...equipments];
                newEquipment.push({
                    type: equipmentType,
                });
                return newEquipment;
            });
        },
    };

    return <CampaignContext.Provider value={value}>
        {children}
    </CampaignContext.Provider>;
}