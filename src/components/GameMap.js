import React from 'react';
import { Map } from '@bucky24/react-canvas-map';

export default function GameMap({ width, height }) {
    return (
        <Map
            width={width}
            height={height}
            x={0}
            y={0}
            mapBackground={{
                color: "#000",
            }}
            offMapBackground={{
                color: "#000",
            }}
        >
        </Map>
    );
}