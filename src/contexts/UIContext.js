import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getTile } from '../data/mapData';
import { getTile as getModuleTile } from '../data/moduleData';
import GameContext from './GameContext';

const UIContext = React.createContext({});
export default UIContext;

export const UI_MODE = {
    GAME: 'mode/game',
    CELL_SELECT: 'mode/cell_select',
    MENU: ' mode/menu',
    SAVE_MENU: 'mode/save_menu',
    GAME_END: 'mode/game_end',
    EQUIPMENT_MENU: 'mode/equipment_menu',
    STATS_MENU: 'mode/stats_menu',
};

export const LOCATION = {
    STRAIGHT_LINES: 'location/straight_lines',
    CIRCLE: 'location/circle',
};

export const LOCATION_FILTER = {
    WALKABLE: 'location_filter/walkable',
    OPEN: 'location_filter/open',
};

export const MENU_ITEMS = [
    'Continue',
    'Equipment',
    'Stats',
    'Save Game',
    'Exit Game',
];

export function UIProvider({ children }) {
    const [mode, setMode] = useState(UI_MODE.GAME);
    const [cellSelectData, setCellSelectData] = useState();
    const [dialog, setDialog] = useState();
    const [showMenu, setShowMenu] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState(0);
    const [tooltip, setTooltip] = useState(null);
    const navigate = useNavigate();
    const { getEntitiesAtPosition } = useContext(GameContext);

    const getCellsMatching = (startX, startY, min, max, type, filters) => {
        let cells = [];
        if (type === LOCATION.STRAIGHT_LINES) {
            // left line
            for (let i=startX-max;i<=startX-min;i++) {
                cells.push({
                    x: i,
                    y: startY,
                    direction: 'left',
                });
            }
            // right line
            for (let i=startX+min;i<=startX+max;i++) {
                cells.push({
                    x: i,
                    y: startY,
                    direction: 'right',
                });
            }
            // top line
            for (let i=startY-max;i<=startY-min;i++) {
                cells.push({
                    x: startX,
                    y: i,
                    direction: 'up',
                });
            }
            // bottom line
            for (let i=startY+min;i<=startY+max;i++) {
                cells.push({
                    x: startX,
                    y: i,
                    direction: 'down',
                });
            }
        } else if (type === LOCATION.CIRCLE) {
            // top line
            for (let i=startX-max;i<=startX+max;i++) {
                cells.push({
                    x: i,
                    y: startY-max,
                    direction: 'circle',
                });
            }
            // bottom line
            for (let i=startX-max;i<=startX+max;i++) {
                cells.push({
                    x: i,
                    y: startY+max,
                    direction: 'circle',
                });
            }
            // left line
            for (let i=startY-max;i<=startY+max;i++) {
                cells.push({
                    x: startX-max,
                    y: i,
                    direction: 'circle',
                });
            }
            // right line
            for (let i=startY-max;i<=startY+max;i++) {
                cells.push({
                    x: startX+max,
                    y: i,
                    direction: 'circle',
                });
            }
        } else if (Array.isArray(type)) {
            cells = [...type];
        } else {
            console.error(`Invalid direction ${type}`);
            callback(null);
            return;
        }

        if (filters) {
            cells = cells.filter((cell) => {
                for (const filter of filters) {
                    if (filter === LOCATION_FILTER.WALKABLE) {
                        const tileData = getTile(cell.x, cell.y);
                        if (!tileData) {
                            return false;
                        }

                        const moduleTile = getModuleTile(tileData.tile);
                        
                        if (moduleTile.type !== "ground") {
                            return false;
                        }
                    } else if (filter === LOCATION_FILTER.OPEN) {
                        const entities = getEntitiesAtPosition(cell.x, cell.y);
                        if (entities.length > 0) return false;
                    }
                }
                return true;
            });
        }
        return cells;
    }

    const value = {
        mode,
        cellSelectData,
        dialog,
        showMenu,
        activeMenuItem,
        tooltip,
        setTooltip,
        getCellsMatching,
        enterCellSelect: (startX, startY, min, max, type, filter, callback) => {
            const data = {
                startX,
                startY,
                min,
                max,
                type,
                callback,
                selected: null,
                filter,
            };

            const cells = getCellsMatching(startX, startY, min, max, type, [filter]);

            if (cells.length === 0) {
                callback(null);
                return;
            }

            data.cells = cells;
            setCellSelectData(data);
            setMode(UI_MODE.CELL_SELECT);
        },
        startDialog: (dialog, character, callback) => {
            setDialog({dialog, character, callback});
        },
        clearDialog: () => {
            if (!dialog) {
                return;
            }

            setDialog(null);

            if (dialog.callback) {
                dialog.callback();
            }
        },
        markCellSelected: (cell) => {
            setCellSelectData({
                ...cellSelectData,
                selected: {...cell},
            });
        },
        acceptSelectedCell: () => {
            cellSelectData.callback(cellSelectData.selected);
            setCellSelectData(null);
            setMode(UI_MODE.GAME);
        },
        setShowMenu,
        setMode,
        setActiveMenuItem,
        chooseMenuItem: () => {
            const item = MENU_ITEMS[activeMenuItem];

            if (item === "Continue") {
                setMode(UI_MODE.GAME);
            } else if (item === "Save Game") {
                setMode(UI_MODE.SAVE_MENU);
            } else if (item === "Exit Game") {
                navigate("/");
            } else if (item === 'Equipment') {
                setMode(UI_MODE.EQUIPMENT_MENU);
            }

            setShowMenu(false);
        }
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
}
