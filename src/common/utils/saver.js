import { saveFile } from 'system';
import { Types } from '../system/systemCommon';

export const saveMap = (fileName, data) => {
	return saveFile(Types.SAVED_MAP, `${fileName}.save`, data);
}