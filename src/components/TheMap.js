import React, { useState, useEffect, useContext } from 'react';
import { Map, Layer, LayerImage } from '@bucky24/react-canvas-map';
import { Canvas } from '@bucky24/react-canvas';

import ModuleContext from '../contexts/ModuleContext';
import ImageContext from '../contexts/ImageContext';

export default function TheMap({ map, onClick }) {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const { tiles } = useContext(ModuleContext);
    const { images } = useContext(ImageContext);

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
                onClick={(cellX, cellY, button) => {
                    if (onClick) {
                        onClick(cellX, cellY, button);
                    }
                }}
            >
                <Layer>
                    {map.map(({ x, y, tile }) => {
                        const tileData = tiles[tile];
                        if (!tileData) {
                            return null;
                        }

                        const image = images[tileData.image];
                        if (!image) {
                            return null;
                        }

                        return (
                            <LayerImage
                                key={`tile_${x}_${y}`}
                                x={x}
                                y={y}
                                src={image}
                                width={1}
                                height={1}
                            />
                        );
                    })}
                </Layer>
            </Map>
        </Canvas>
    );
}