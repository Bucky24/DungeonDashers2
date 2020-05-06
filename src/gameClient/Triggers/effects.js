import store from '../store';

import { Panes, setUIPane } from '../store/ducks/ui';
import { getActiveCampaign, getMaps, getIsCustom } from '../store/getters/campaign';
import { getMapMeta } from '../store/getters/map';
import { saveCampaign } from '../../common/utils/saver';
import { setCurrentMap } from '../store/ducks/campaign';

export const winGame = () => {
	const state = store.getState();
	// if we have an active campaign, we need to credit the win
	const activeCampaign = getActiveCampaign(state);
	
	const mapMeta = getMapMeta(state);
	const { activeMap } = mapMeta;
	
	if (activeCampaign) {
		const maps = getMaps(state);
		const currentIndex = maps.indexOf(activeMap);
		const newIndex = Math.min(currentIndex + 1, maps.length-1);
		
		const newMap = maps[newIndex];
		store.dispatch(setCurrentMap(newMap));

		
		saveCampaign(activeCampaign, newMap, getIsCustom(state));
	}
	
	store.dispatch(setUIPane(Panes.WON_GAME));
}