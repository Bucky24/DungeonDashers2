import React, { Component } from 'react';
import { Canvas, Image } from '@bucky24/react-canvas';
import MainMenu from '../MainMenu';

import TitleImage from '../Menus/TitleImage';

class MenuHandler extends Component {
	render() {
		const { width, height } = this.props;
		return (<Canvas width={width} height={height}>
			<TitleImage width={width} height={height} />
			<MainMenu width={width} height={height} />
		</Canvas>);
	}
}

export default MenuHandler;
