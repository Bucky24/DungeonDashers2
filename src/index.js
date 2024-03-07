import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { EditorProvider } from './contexts/EditorContext';
import { GameProvider } from './contexts/GameContext';
import { ImageProvider } from './contexts/ImageContext';
import { MapProvider } from './contexts/MapContext';
import { ModuleProvider } from './contexts/ModuleContext';
import { UIProvider } from './contexts/UIContext';

const root = createRoot(document.getElementById('root'));

root.render(
    <UIProvider>
        <ImageProvider>
            <ModuleProvider>
                <MapProvider>
                    <EditorProvider>
                        <GameProvider>
                            <App />
                        </GameProvider>
                    </EditorProvider>
                </MapProvider>
            </ModuleProvider>
        </ImageProvider>    
    </UIProvider>
);
