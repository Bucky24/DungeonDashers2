import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import styles from './styles.css';

import Game from './views/Game';
import MapEditor from './views/MapEditor';
import ModuleEditor from './views/ModuleEditor';
import NewGame from './views/NewGame';
import LoadGame from './views/LoadGame';
import MainMenu from './views/MainMenu';
import Debug from './views/Debug';
import CampaignView from './views/CampaignView';
import EditorMenu from './views/EditorMenu';
import MapEditorMenu from './views/MapEditorMenu';
import MapEditorLoadMenu from './views/MapEditorLoadMenu';
import CampaignEditorMenu from './views/CampaignEditorMenu';
import CampaignEditorLoadMenu from './views/CampaignEditorLoadMenu';
import CampaignEditor from './views/CampaignEditor';

export default function App() {
	return (<BrowserRouter>
		<div className={styles.appRoot}>
			<Routes>
				<Route path="/game" element={<Game />} />
				<Route path="/game/new/:map" element={<NewGame />} />
				<Route path="/game/new/:campaign/:map" element={<NewGame />} />
				<Route path="/game/load/:game" element={<LoadGame />} />
				<Route path="/editor" element={<EditorMenu />} />
				<Route path="/editor/map" element={<MapEditorMenu />} />
				<Route path="/editor/map/load" element={<MapEditorLoadMenu />} />
				<Route path="/editor/map/new/:map" element={<MapEditor newMap />} />
				<Route path="/editor/map/:map" element={<MapEditor />} />
				<Route path="/editor/module/:module" element={<ModuleEditor />} />
				<Route path="/editor/campaign" element={<CampaignEditorMenu />} />
				<Route path="/editor/campaign/load" element={<CampaignEditorLoadMenu />} />
				<Route path="/editor/campaign/:campaign" element={<CampaignEditor />} />
				<Route path="/campaign/:campaign" element={<CampaignView />} />
				<Route path="/debug" element={<Debug />} />
				<Route path="/" element={<MainMenu />} />
			</Routes>
		</div>
	</BrowserRouter>);
}