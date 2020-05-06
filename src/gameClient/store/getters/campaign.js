export const getGold = (state) => {
	return state.campaign.gold || 0;
}

export const getCharacterData = (state) => {
	return state.campaign.characterData || {};
}

export const getUnassignedEquipment = (state) => {
	return state.campaign.floatingEquipment;
}

export const getActiveCampaign = (state) => {
	return state.campaign.campaign;
}

export const getMaps = (state) => {
	return state.campaign.campaignMaps;
}

export const getCurrentMap = (state) => {
	return state.campaign.currentMap;
}

export const getIsCustom = (state) => {
	return state.campaign.isCustom;
}
