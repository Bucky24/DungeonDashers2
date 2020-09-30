import store from '../store';
import { onOnce, Events } from '../eventEmitter/emitter';

import { Panes, setUIPane } from '../store/ducks/ui';
import { getActiveCampaign, getMaps, getIsCustom } from '../store/getters/campaign';
import { getMapMeta } from '../store/getters/map';
import { saveCampaign } from '../../common/utils/saver';
import { setCurrentMap } from '../store/ducks/campaign';
import { setPause, setCameraCenter, setDialog, createCharacter } from '../store/ducks/map';
import { getCharacters } from "../store/getters/map";
import { getCharacterData } from '../store/getters/gameData';

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

export const gamePause = (data) => {
	const pause = data.pause;

	store.dispatch(setPause(pause));
}

export const centerCamera = ({ x, y }) => {
	store.dispatch(setCameraCenter(x, y));
}

export const showDialog = ({ text, characterIdent }) => {
	store.dispatch(setDialog(text, characterIdent));

	// don't continue until dialog is dismissed
	return new Promise((resolve) => {
		onOnce(Events.DIALOG_DISMISSED, () => {
			resolve();
		});
	});
}

export const spawnCharacter = ({ ident, x, y }, state) => {
	const characters = getCharacters(state);
	const baseCharacterData = getCharacterData(state);

	let characterExists = false;
	for (const char of characters) {
		if (char.ident === ident) {
			characterExists = true;
			break;
		}
	}

	if (characterExists) {
		return;
	}

	const data = baseCharacterData[ident];

	if (!data) {
		console.error("Cannot find character data for ident" + ident);
		return;
	}

	const charData = {
		...data,
		x,
		y,
		hp: data.maxHP,
	};

	store.dispatch(createCharacter(charData));
}