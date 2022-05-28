import React, { useState, useEffect } from 'react';
import { Map } from '@bucky24/react-canvas-map';
import { Canvas } from '@bucky24/react-canvas';

export default function GameMap() {
    const [size, setSize] = useState({ width: 0, height: 0 });

    const resize = () => {
        setSize({
            width: window.innerWidth,
            height: innerHeight,
        });
    }

    useEffect(() => {
        window.addEventListener("resize", resize);
        resize();

        return () => {
            window.removeEventListener("resize", resize);
        }
    }, []);

    return (
		<Canvas width={size.width} height={size.height}>
            <Map
                width={size.width}
                height={size.height}
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
        </Canvas>
    );
}