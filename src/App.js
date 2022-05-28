import React from 'react';

import styles from './styles.css';

import GameMap from './components/GameMap';

export default function App() {

	return (<div className={styles.appRoot}>
        <GameMap />
	</div>);
}