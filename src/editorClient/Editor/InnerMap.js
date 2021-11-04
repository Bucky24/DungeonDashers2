import React, { useContext } from 'react';
import { Canvas } from '@bucky24/react-canvas';
import { Map } from '@bucky24/react-canvas-map';
import { SizeContext } from '@bucky24/mobile-detect';

const InnerMap = ({ onClick, layers, cellSize }) => {
    const { width, height } = useContext(SizeContext);

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
