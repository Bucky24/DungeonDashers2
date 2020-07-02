import React from 'react';

import TitleBackground from '../../common/assets/title_screen.png';

const MainMenu = ({ width, height }) => {
	return <div style={{
		width: '100%',
		height: '100%',
	}}>
		<img
			style={{
				width: '100%',
				height: '100%',
			}}
			src={TitleBackground}
		/>
	</div>;
};

export default MainMenu;
