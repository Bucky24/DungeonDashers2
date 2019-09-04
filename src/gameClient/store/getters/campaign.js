export const getGold = (state) => {
	return state.campaign.gold || 0;
}

export const getCharacterData = (state) {
	return state.campaign.characterData || {};
}
