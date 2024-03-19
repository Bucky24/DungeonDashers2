import React, { useState, useEffect, useContext, useRef } from 'react';
import { Map, Layer, LayerImage, ZoomType, MoveType, Cell } from '@bucky24/react-canvas-map';
import { Canvas, Rect } from '@bucky24/react-canvas';

import ModuleContext from '../contexts/ModuleContext';
import NotFoundImage from '../../assets/not_found.png';
import { BASE_STATES } from '../contexts/MapContext';

export default function TheMap({
    map,
    objects,
    characters,
    onClick,
    onHover,
    showInvalidEntities,
    hideObjects,
    zoom,
    zoomLocked,
    onKey,
    moveLocked,
    centerX,
    centerY,
    selectionRectangles,
    selectedRectangle,
}) {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const { tiles, getImage, objects: objectsData, characters: charactersData } = useContext(ModuleContext);
    const [mouseX, setMouseX] = useState(-1);
    const [mouseY, setMouseY] = useState(-1);
    const hoverRef = useRef(null);
    const [keys, setKeys] = useState([]);

    const resize = () => {
        setSize({
            width: window.innerWidth,
            height: window.innerHeight,
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
                const items = [];
                for (const tile of map) {
                    if (tile.x === mouseX && tile.y === mouseY) {
                        items.push({
                            type: 'tile',
                            data: {
                                id: tile.tile,
                                x: tile.x,
                                y: tile.y,
                            },
                        });
                    }
                }

                for (const object of objects) {
                    if (object.x === mouseX && object.y === mouseY) {
                        items.push({
                            type: 'object',
                            data: {
                                id: object.type,
                                x: object.x,
                                y: object.y,
                            },
                        });
                    }
                }

                for (const object of characters) {
                    if (object.x === mouseX && object.y === mouseY) {
                        items.push({
                            type: 'character',
                            data: {
                                id: object.type,
                                x: object.x,
                                y: object.y,
                            },
                        });
                    }
                }

                onHover(items);
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
            onKeyDown={({ code }) => {
                if (keys.includes(code)) {
                    return;
                }
                if (onKey) {
                    keys.push(code);
                    onKey(code);
                }
            }}
            onKeyUp={({ code }) => {
                const index = keys.indexOf(code);
                if (index > -1) {
                    keys.splice(index, 1);
                }
            }}
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
                zoom={zoom}
                zoomType={zoomLocked ? ZoomType.FIXED : ZoomType.MOUSE}
                moveType={moveLocked ? MoveType.NONE : MoveType.MOUSE}
                centerX={centerX}
                centerY={centerY}
            >
                <Layer>
                    {map?.map(({ x, y, tile }, index) => {
                        const tileData = tiles[tile];
                        let image = getImage(tileData?.image);

                        if (!image) {
                            if (!showInvalidEntities) {
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
                <Layer>
                    {objects?.map((obj, index) => {
                        const objectData = objectsData[obj.type];
                        let image = null;
                        let width = 1;
                        let height = 1;

                        if (objectData) {
                            const state = obj.state || objectData.defaultState;

                            const imageForState = objectData.images[state];

                            if (imageForState) {
                                const imageName = imageForState.image;
                                image = getImage(imageName);
                            }
                        }

                        if (!image) {
                            if (showInvalidEntities) {
                                image = NotFoundImage;
                            } else {
                                return;
                            }
                        }

                        return (
                            <LayerImage
                                key={`object_${obj.x}_${obj.y}_${index}`}
                                x={obj.x}
                                y={obj.y}
                                src={image}
                                width={1}
                                height={1}
                            />
                        );
                    })}
                </Layer>
                <Layer>
                    {characters?.map((character, index) => {
                        const data = charactersData[character.type];
                        let image = null;
                        let width = data?.width || 1;
                        let height = data?.height || 1;

                        if (data) {
                            const state = character.state || BASE_STATES.RIGHT;

                            const imageForState = data.images[state];

                            if (imageForState) {
                                const imageName = imageForState.image;
                                image = getImage(imageName);
                            }
                        }

                        if (!image) {
                            if (showInvalidEntities) {
                                image = NotFoundImage;
                            } else {
                                return;
                            }
                        }

                        return (
                            <LayerImage
                                key={`character_${character.x}_${character.y}_${index}`}
                                x={character.x}
                                y={character.y-height+1}
                                src={image}
                                width={width}
                                height={height}
                            />
                        );
                    })}
                </Layer>
                {selectionRectangles && <Layer>
                    {selectionRectangles.map(({ x, y }) => {
                        return <Cell
                            key={`selection_${x}_${y}`}
                            x={x}
                            y={y}
                            width={1}
                            height={1}
                            cb={(dims) => {
                                return <Rect
                                    {...dims}
                                    color="#0f0"
                                    fill={selectedRectangle?.x === x && selectedRectangle?.y === y}
                                />
                            }}
                        />
                    })}
                </Layer>}
            </Map>
        </Canvas>
    );
}