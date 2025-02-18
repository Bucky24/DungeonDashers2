import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from'react-router-dom';

import App from './App';
import { EditorProvider } from './contexts/EditorContext';
import { GameProvider } from './contexts/GameContext';
import { AssetProvider } from './contexts/AssetContext';
import { MapProvider } from './contexts/MapContext';
import { ModuleProvider } from './contexts/ModuleContext';
import { UIProvider } from './contexts/UIContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { CampaignProvider } from './contexts/CampaignContext';
import Coms from './utils/coms';
import { SearchProvider } from './contexts/SearchContext';

const root = createRoot(document.getElementById('root'));

const providerStack = (
<SettingsProvider>
    <SearchProvider>
        <UIProvider>
            <AssetProvider>
                <CampaignProvider>
                    <ModuleProvider>
                        <MapProvider>
                            <EditorProvider>
                                <GameProvider>
                                    <App />
                                </GameProvider>
                            </EditorProvider>
                        </MapProvider>
                    </ModuleProvider>
                </CampaignProvider>
            </AssetProvider>    
        </UIProvider>
    </SearchProvider>
</SettingsProvider>
);

if (Coms.isElectron) {
    // browser router doesn't work with electron
    root.render(<HashRouter>{providerStack}</HashRouter>);
}

root.render(<BrowserRouter>
    {providerStack}
</BrowserRouter>);
