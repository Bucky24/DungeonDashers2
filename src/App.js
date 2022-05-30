import React, { useContext, useEffect } from 'react';

import styles from './styles.css';

import GameMap from './components/GameMap';
import GameContext from './contexts/GameContext';
import ModuleContext from './contexts/ModuleContext';
import ImageContext from './contexts/ImageContext';

export default function App() {
	const { loadGame, loaded: gameLoaded } = useContext(GameContext);
	const { loaded: moduleLoaded } = useContext(ModuleContext);
	const { loaded: imagesLoaded } = useContext(ImageContext);

	useEffect(() => {
		loadGame('main');
	}, []);

	const loaded = gameLoaded && moduleLoaded && imagesLoaded;

	return (<div className={styles.appRoot}>
		{!loaded && (
			<div>
				Loading
			</div>
		)}
		{loaded && (
			<GameMap />
		)}
	</div>);
}