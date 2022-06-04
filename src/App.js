import React, { useContext } from 'react';

import styles from './styles.css';

import UIContext, { PANES } from './contexts/UIContext';
import Game from './components/Game';

export default function App() {
	const { pane } = useContext(UIContext);

	return (<div className={styles.appRoot}>
		{pane === PANES.APP && <Game />}
	</div>);
}