import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import styles from './styles.css';

import UIContext, { PANES } from './contexts/UIContext';
import Game from './views/Game';
import MapEditor from './views/MapEditor';
import ModuleEditor from './views/ModuleEditor';
import Home from './views/Home';
import NewGame from './views/NewGame';

export default function App() {
	const { pane } = useContext(UIContext);

	return (<BrowserRouter>
		<div className={styles.appRoot}>
			<Routes>
				<Route path="/game" element={<Game />} />
				<Route path="/game/new/:map" element={<NewGame />} />
				<Route path="/editor/map/:map" element={<MapEditor />} />
				<Route path="/editor/module/:module" element={<ModuleEditor />} />
				<Route path="/" element={<Home />} />
			</Routes>
		</div>
	</BrowserRouter>);
}