import React from 'react';

import TitleScreen from '../../assets/title_screen.png';
import StandardMenu from '../components/StandardMenu';

export default function MainMenu() {
    return <div style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${TitleScreen})`,
        backgroundSize: 'cover',
        backgroundPositionX: 'center',
    }}>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            height: 'calc(100% - 100px)',
        }}>
            <StandardMenu
                items={["New Game", "Load Game", "Settings", "Exit Game"]}
                onSelect={(item) => {
                    console.log(item);
                }}
            />
        </div>
    </div>
}