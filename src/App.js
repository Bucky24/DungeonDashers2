import React, { useContext } from 'react';

import styles from './styles.css';

import UIContext, { PANES } from './contexts/UIContext';
import Game from './components/Game';
import Editor from './components/Editor';

export default function App() {
	const { pane } = useContext(UIContext);

	return (<div className={styles.appRoot}>
		{pane === PANES.APP && <Game />}
		{pane === PANES.EDITOR_MAP && <Editor />}
	</div>);
}