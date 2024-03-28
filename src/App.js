import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import styles from './styles.css';

import UIContext from './contexts/UIContext';
import Game from './views/Game';
import MapEditor from './views/MapEditor';
import ModuleEditor from './views/ModuleEditor';
import NewGame from './views/NewGame';
import LoadGame from './views/LoadGame';
import MainMenu from './views/MainMenu';
import Debug from './views/Debug';

export default function App() {
	const { pane } = useContext(UIContext);

	return (<BrowserRouter>
		<div className={styles.appRoot}>
			<Routes>
				<Route path="/game" element={<Game />} />
				<Route path="/game/new/:map" element={<NewGame />} />
				<Route path="/game/load/:game" element={<LoadGame />} />
				<Route path="/editor/map/:map" element={<MapEditor />} />
				<Route path="/editor/module/:module" element={<ModuleEditor />} />
				<Route path="/debug" element={<Debug />} />
				<Route path="/" element={<MainMenu />} />
			</Routes>
		</div>
	</BrowserRouter>);
}