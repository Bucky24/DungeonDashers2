import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { EditorProvider } from './contexts/EditorContext';
import { GameProvider } from './contexts/GameContext';
import { ImageProvider } from './contexts/ImageContext';
import { MapProvider } from './contexts/MapContext';
import { ModuleProvider } from './contexts/ModuleContext';
import { UIProvider } from './contexts/UIContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { CampaignProvider } from './contexts/CampaignContext';

const root = createRoot(document.getElementById('root'));

root.render(
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
