import React, { useContext } from 'react';

import styles from './styles.css';

import UIContext, { PANES } from './contexts/UIContext';
import Game from './views/Game';
import MapEditor from './views/MapEditor';
import ModuleEditor from './views/ModuleEditor';
import Home from './views/Home';

export default function App() {
	const { pane } = useContext(UIContext);

	return (<div className={styles.appRoot}>
		{pane === PANES.APP && <Game />}
		{pane === PANES.EDITOR_MAP && <MapEditor />}
		{pane === PANES.EDITOR_MODULE && <ModuleEditor />}
		{pane === PANES.HOME && <Home />}
	</div>);
}