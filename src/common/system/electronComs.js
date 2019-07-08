const { ipcRenderer } = window.require('electron');

const callbackMap = {};
let requestID = 0;

ipcRenderer.on('response', (event, { id, success, error, data }) => {	
	if (!callbackMap[id]) {
		console.log('no callback for id', id);
		return;
	}
	const callback = callbackMap[id];
	callback(success, data, error);
	delete callbackMap[id];
});

export const request = (type, data, cb) => {
	const id = requestID;
	requestID ++;
	callbackMap[id] = cb;
	
	ipcRenderer.send(type, {
		__data: data,
		id
	});
}

export const promiseRequest = (type, data) => {
	return new Promise((resolve, reject) => {
		request(type, data, (success, result, error) => {
			if (!success) {
				reject(error);
			}
			
			resolve(result);
		});
	});
};