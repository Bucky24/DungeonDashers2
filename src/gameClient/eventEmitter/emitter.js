const handlers = {};
const onceHandlers = {};

export const onOnce = (event, fn) => {
	if (!onceHandlers[event]) {
		onceHandlers[event] = [];
	}
	
	onceHandlers[event].push(fn);
};

export const fireEvent = (event, data) => {
	if (onceHandlers[event]) {
		onceHandlers[event].forEach((fn) => {
			fn(data);
		});
		// reset since these are run once only
		onceHandlers[event] = [];
	}
};
