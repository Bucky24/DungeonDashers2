import { Canvas, Rect, Text } from '@bucky24/react-canvas';
import { Cell, Layer, LayerImage, Map, MoveType, ZoomType } from '@bucky24/react-canvas-map';
import React, { useContext, useEffect, useRef, useState } from 'react';

import NotFoundImage from '../../assets/not_found.png';
import { FLAGS } from '../contexts/GameContext';
import { BASE_STATES } from '../contexts/MapContext';
import ModuleContext from '../contexts/ModuleContext';

export default function TheMap({
    map,
    objects,
    characters,
    enemies,
    onClick,
    onHover,
    showInvalidEntities,
    zoom,
    zoomLocked,
    onKey,
    moveLocked,
    centerX,
    centerY,
    selectionRectangles,
    selectedRectangle,
    inCombat,
    combatTurnName,
    combatPointsLeft,
    combatPointsMax,
    combatHp,
    combatMaxHp,
    fullFocus,
    showInactive,
    heightOffset,
}) {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const {
        tiles,
        getImage,
        objects: objectsData,
        characters: charactersData,
        enemies: enemiesData,
    } = useContext(ModuleContext);
    const [mouseX, setMouseX] = useState(-1);
    const [mouseY, setMouseY] = useState(-1);
    const hoverRef = useRef(null);
    const [keys, setKeys] = useState([]);

    const resize = () => {
        setSize({
            width: window.innerWidth,
            height: window.innerHeight - (heightOffset || 0),
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
                    setKeys([
                        ...keys,
                        code,
                    ]);
                    onKey(code);
                }
            }}
            onKeyUp={({ code }) => {
                const index = keys.indexOf(code);
                if (index > -1) {
                    const newKeys = [...keys];
                    newKeys.splice(index, 1);
                    setKeys(newKeys);
                }
            }}
            captureAllKeyEvents={fullFocus}
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
                <Layer id="tiles">
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
                <Layer id="objects">
                    {objects?.map((obj, index) => {
                        const objectData = objectsData[obj.type];
                        let image = null;
                        let width = objectData.width || 1;
                        let height = objectData.height || 1;

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
                                width={width}
                                height={height}
                            />
                        );
                    })}
                </Layer>
                <Layer id="entities">
                    {characters?.map((character, index) => {
                        const data = charactersData[character.type];
                        let image = null;
                        let width = data?.width || 1;
                        let height = data?.height || 1;

                        let maxHp = 1;
                        let hp = character.hp;

                        if (data) {
                            const state = character.state || BASE_STATES.DOWN;

                            let imageForState = data.images[state];

                            if (!imageForState) {
                                for (const key in BASE_STATES) {
                                    const state = BASE_STATES[key];
                                    if (data.images[state]) {
                                        imageForState = data.images[state];
                                        break;
                                    }
                                }
                            }

                            if (imageForState) {
                                const imageName = imageForState.image;
                                image = getImage(imageName);
                            }

                            maxHp = data.maxHP;
                            if (!hp) {
                                hp = maxHp;
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
                            <React.Fragment key={`character_${character.x}_${character.y}_${index}`}>
                                <LayerImage
                                    x={character.x}
                                    y={character.y-height+1}
                                    src={image}
                                    width={width}
                                    height={height}
                                />
                                {inCombat && <Cell
                                    x={character.x}
                                    y={character.y-height+1}
                                    width={width}
                                    height={height}
                                    cb={(dims) => {
                                        if (!maxHp) {
                                            return;
                                        }
                                        const perPixel = dims.width / maxHp;
                                        const pixels = perPixel * hp;

                                        return <>
                                            <Rect
                                                x={dims.x}
                                                x2={dims.x2}
                                                y={dims.y}
                                                y2={dims.y+5}
                                                color="#f00"
                                                fill={true}
                                            />
                                            <Rect
                                                x={dims.x}
                                                x2={dims.x + pixels}
                                                y={dims.y}
                                                y2={dims.y+5}
                                                color="#0f0"
                                                fill={true}
                                            />
                                        </>;
                                    }}
                                />}
                            </React.Fragment>
                        );
                    })}
                    {enemies?.map((enemy, index) => {
                        if (enemy.flags?.includes(FLAGS.INACTIVE) && !showInactive) {
                            return;
                        }
                        const data = enemiesData[enemy.type];
                        let image = null;
                        let width = data?.width || 1;
                        let height = data?.height || 1;

                        let maxHp = 1;
                        let hp = enemy.hp;

                        if (data) {
                            const state = enemy.state || BASE_STATES.RIGHT;

                            const imageForState = data.images[state];

                            if (imageForState) {
                                const imageName = imageForState.image;
                                image = getImage(imageName);
                            }

                            maxHp = data.maxHP;
                            if (!hp) {
                                hp = maxHp;
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
                            <React.Fragment key={`enemy_${enemy.x}_${enemy.y}_${index}`}>
                                <LayerImage
                                    x={enemy.x}
                                    y={enemy.y-height+1}
                                    src={image}
                                    width={width}
                                    height={height}
                                />
                                {inCombat && <Cell
                                    x={enemy.x}
                                    y={enemy.y-height+1}
                                    width={width}
                                    height={height}
                                    cb={(dims) => {
                                        const perPixel = dims.width / maxHp;
                                        const pixels = perPixel * hp;
                                        return <>
                                            <Rect
                                                x={dims.x}
                                                x2={dims.x2}
                                                y={dims.y}
                                                y2={dims.y+5}
                                                color="#f00"
                                                fill={true}
                                            />
                                            <Rect
                                                x={dims.x}
                                                x2={dims.x + pixels}
                                                y={dims.y}
                                                y2={dims.y+5}
                                                color="#0f0"
                                                fill={true}
                                            />
                                        </>;
                                    }}
                                />}
                            </React.Fragment>
                        );
                    })}
                </Layer>
                {selectionRectangles && <Layer id="selection">
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
            {inCombat && <>
                <Rect
                    x={size.width-200}
                    y={size.height-200}
                    x2={size.width}
                    y2={size.height}
                    color="#fff"
                    fill={true}
                />
                <Text x={size.width-200} y={size.height-200+24} font="24px Arial">Combat</Text>
                <Text x={size.width-200} y={size.height-200+36} font="12px Arial">Current Turn: {combatTurnName}</Text>
                <Text x={size.width-200} y={size.height-200+48} font="12px Arial">AP Left: {combatPointsLeft}/{combatPointsMax}</Text>
                <Text x={size.width-200} y={size.height-200+60} font="12px Arial">HP: {combatHp}/{combatMaxHp}</Text>
            </>}
        </Canvas>
    );
}