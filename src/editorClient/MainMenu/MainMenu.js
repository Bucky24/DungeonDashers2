import React from 'react';
import { Image, Canvas } from '@bucky24/react-canvas';

import VerticalMenu from '../../common/Inputs/VerticalMenu';

import TitleBackground from '../../common/assets/title_screen.png';

const MainMenu = ({ width, height, setTool }) => {
	const buttons = [
		{text: "Scenario Editor", id: "scenario"},
		{text: "Campaign Editor", id: "campaign"}
	];

	return <Canvas
		width={width}
		height={height}
	>
		<Image
			src={TitleBackground}
			width={width}
			height={height}
			x={0}
			y={0}
		/>
		<VerticalMenu
			buttons={buttons}
			midX={width/2-50}
			startY={height-300}
			padding={10}
			height={30}
			width={100}
			onSelect={(id) => {
				setTool(id);
			}}
		/>
	</Canvas>;
};

export default MainMenu;
