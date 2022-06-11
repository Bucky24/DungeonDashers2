import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { EditorProvider } from './contexts/EditorContext';
import { GameProvider } from './contexts/GameContext';
import { ImageProvider } from './contexts/ImageContext';
import { MapProvider } from './contexts/MapContext';
import { ModuleProvider } from './contexts/ModuleContext';
import { UIProvider } from './contexts/UIContext';

ReactDOM.render(
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
,document.getElementById('root'));
