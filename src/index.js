import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from'react-router-dom';

import App from './App';
import { EditorProvider } from './contexts/EditorContext';
import { GameProvider } from './contexts/GameContext';
import { ImageProvider } from './contexts/ImageContext';
import { MapProvider } from './contexts/MapContext';
import { ModuleProvider } from './contexts/ModuleContext';
import { UIProvider } from './contexts/UIContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { CampaignProvider } from './contexts/CampaignContext';
import Coms from './utils/coms';

const root = createRoot(document.getElementById('root'));

const providerStack = (
<SettingsProvider>
    <UIProvider>
        <ImageProvider>
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
        </ImageProvider>    
    </UIProvider>
</SettingsProvider>
);

if (Coms.isElectron) {
    // browser router doesn't work with electron
    root.render(<HashRouter>{providerStack}</HashRouter>);
}

root.render(<BrowserRouter>
    {providerStack}
</BrowserRouter>);
