import React, { Component } from 'react';
import { Canvas } from 'react-canvas';
import MainMenu from '../MainMenu';
//import './style.css';

class MenuHandler extends Component {
	render() {
		const { width, height } = this.props;
		return (<Canvas width={width} height={height}>
			<MainMenu />
		</Canvas>);
	}
}

export default MenuHandler;
