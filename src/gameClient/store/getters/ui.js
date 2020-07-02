export const getPane = (state) => {
	return state.ui.uiPane;
}

export const getChooseLoc = (state) => {
	return {
		choosing: state.ui.choosingLocation,
		min: state.ui.locMin,
		max: state.ui.locMax,
		type: state.ui.locType,
		startX: state.ui.locStartX,
		startY: state.ui.locStartY,
	};
}
