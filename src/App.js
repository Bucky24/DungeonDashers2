import React, { useContext, useEffect } from 'react';

import styles from './styles.css';

import GameMap from './components/GameMap';
import GameContext from './contexts/GameContext';

export default function App() {
	const { loadGame } = useContext(GameContext);

	useEffect(() => {
		loadGame('main');
	}, []);

	return (<div className={styles.appRoot}>
        <GameMap />
	</div>);
}