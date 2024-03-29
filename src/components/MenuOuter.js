import React from 'react';

import TitleScreen from '../../assets/title_screen.png';

export default function MenuOuter({ children }) {
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
            {children}
        </div>
    </div>
}