import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { GameProvider } from './contexts/GameContext';
import { ImageProvider } from './contexts/ImageContext';
import { ModuleProvider } from './contexts/ModuleContext';

ReactDOM.render(
    <ImageProvider>
        <ModuleProvider>
            <GameProvider>
                <App />    
            </GameProvider>
        </ModuleProvider>
    </ImageProvider>
,document.getElementById('root'));
