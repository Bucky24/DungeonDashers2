import { saveFile } from 'system';
import { Types } from '../system/systemCommon';

export const saveMap = (fileName, data) => {
	return saveFile(Types.SAVED_MAP, `${fileName}.save`, data);
}

export const saveCampaign = (campaignName, activeMap, custom) => {
	const data = {
		version: 1,
		type: 'campaign',
		activeMap,
		campaignName,
		custom,
	}
	
	const fileName = `${campaignName}.save`;
	return saveFile(Types.SAVED_CAMPAIGN, fileName, data);
}
