import React from 'react';
import { Canvas } from '@bucky24/react-canvas';
import { Map } from '@bucky24/react-canvas-map';

const InnerMap = ({ width, height, onClick, layers, cellSize }) => {
    return <Canvas
        width={width}
        height={height}
    >
        <Map
            x={0}
            y={0}
            width={width}
            height={height}
            onClick={onClick}
            layers={layers}
            cellSize={cellSize}
            renderLayersToImage={false}
        />
    </Canvas>;
}

export default InnerMap;
