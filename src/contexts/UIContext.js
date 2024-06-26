import React, { useState } from 'react';

const UIContext = React.createContext({});
export default UIContext;

export const UI_MODE = {
    GAME: 'mode/game',
    CELL_SELECT: 'mode/cell_select',
    MENU: ' mode/menu',
    SAVE_MENU: 'mode/save_menu',
    GAME_END: 'mode/game_end',
};

export const LOCATION = {
    STRAIGHT_LINES: 'location/straight_lines',
};

export const MENU_ITEMS = [
    'Continue',
    'Save Game',
    'Exit Game',
];

export function UIProvider({ children }) {
    const [mode, setMode] = useState(UI_MODE.GAME);
    const [cellSelectData, setCellSelectData] = useState();
    const [dialog, setDialog] = useState();
    const [showMenu, setShowMenu] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState(0);

    const value = {
        mode,
        cellSelectData,
        dialog,
        showMenu,
        activeMenuItem,
        enterCellSelect: (startX, startY, min, max, type, callback) => {
            const data = {
                startX,
                startY,
                min,
                max,
                type,
                callback,
                selected: null,
            };

            const cells = [];
            if (type === LOCATION.STRAIGHT_LINES) {
                // left line
                for (let i=startX-max;i<=startX-min;i++) {
                    cells.push({
                        x: i,
                        y: startY,
                    });
                }
                // right line
                for (let i=startX+min;i<=startX+max;i++) {
                    cells.push({
                        x: i,
                        y: startY,
                    });
                }
                // top line
                for (let i=startY-max;i<=startY-min;i++) {
                    cells.push({
                        x: startX,
                        y: i,
                    });
                }
                // bottom line
                for (let i=startY+min;i<=startY+max;i++) {
                    cells.push({
                        x: startX,
                        y: i,
                    });
                }
            } else {
                console.error(`Invalid direction ${type}`);
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
