import React, { useState } from 'react';

const UIContext = React.createContext({});
export default UIContext;

export const PANES = {
    APP: 'app',
    EDITOR_MAP: 'editor/map',
};

export function UIProvider({ children }) {
    const [pane, setPane] = useState(PANES.EDITOR_MAP);

    const value = {
        pane,
        setPane,
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
}
