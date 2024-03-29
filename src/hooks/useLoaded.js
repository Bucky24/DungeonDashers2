import { useContext } from 'react';

import GameContext from '../contexts/GameContext';
import ModuleContext from '../contexts/ModuleContext';
import ImageContext from '../contexts/ImageContext';
import MapContext from '../contexts/MapContext';
import SettingsContext from '../contexts/SettingsContext';
import CampaignContext from '../contexts/CampaignContext';

export default function() {
    const { loaded: gameLoaded } = useContext(GameContext);
	const { loaded: moduleLoaded } = useContext(ModuleContext);
	const { loaded: imagesLoaded } = useContext(ImageContext);
    const { loaded: mapLoaded } = useContext(MapContext);
    const { loaded: settingsLoaded } = useContext(SettingsContext);
    const { loaded: campaignLoaded } = useContext(CampaignContext);

	const loaded = gameLoaded && moduleLoaded && imagesLoaded && mapLoaded && settingsLoaded && campaignLoaded;
    const campaign = imagesLoaded && settingsLoaded && campaignLoaded;

    return {
        allLoaded: loaded,
        campaignLoaded: campaign,
    };
}