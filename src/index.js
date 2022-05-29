import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { GameProvider } from './contexts/GameContext';
import { ModuleProvider } from './contexts/ModuleContext';

ReactDOM.render(
    <ModuleProvider>
        <GameProvider>
            <App />    
        </GameProvider>
    </ModuleProvider>

,document.getElementById('root'));
