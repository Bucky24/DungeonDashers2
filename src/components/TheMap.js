import React, { useState, useEffect, useContext, useRef } from 'react';
import { Map, Layer, LayerImage } from '@bucky24/react-canvas-map';
import { Canvas } from '@bucky24/react-canvas';

import ModuleContext from '../contexts/ModuleContext';
import ImageContext from '../contexts/ImageContext';
import NotFoundImage from '../../assets/not_found.png';

export default function TheMap({ map, onClick, onHover, showInvalidTiles }) {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const { tiles } = useContext(ModuleContext);
    const { images } = useContext(ImageContext);
    const [mouseX, setMouseX] = useState(-1);
    const [mouseY, setMouseY] = useState(-1);
    const hoverRef = useRef(null);

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

    useEffect(() => {
        if (onHover) {
            clearTimeout(hoverRef.current);

            hoverRef.current = setTimeout(() => {
                // need a more efficient way
                const tiles = [];
                for (const tile of map) {
                    if (tile.x === mouseX && tile.y === mouseY) {
                        tiles.push(tile);
                    }
                }

                if (tiles.length > 0) {
                    onHover(tiles);
                }
            }, 500);
        }

        return () => {
            clearTimeout(hoverRef.current);
        }
    }, [mouseX, mouseY, onHover]);

    return (
		<Canvas
            width={size.width}
            height={size.height}
        >
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
                onMove={(cellX, cellY) => {
                    setMouseX(cellX);
                    setMouseY(cellY);
                }}
            >
                <Layer>
                    {map.map(({ x, y, tile }, index) => {
                        const tileData = tiles[tile];
                        let image = images[tileData?.image];

                        if (!image) {
                            if (!showInvalidTiles) {
                                return;
                            }
                            image = NotFoundImage;
                        }

                        return (
                            <LayerImage
                                key={`tile_${x}_${y}_${index}`}
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