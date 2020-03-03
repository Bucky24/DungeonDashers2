import React from 'react';
import { Image } from '@bucky24/react-canvas';

import TitleBackground from '../../common/assets/title_screen.png';

export default ({ width, height }) => {
	return <Image
		src={TitleBackground}
		x={0}
		y={0}
		width={width}
		height={height}
	/>;
};
