import React, { useState } from 'react';

const UIContext = React.createContext({});
export default UIContext;

export const PANES = {
    APP: 'app',
};

export function UIProvider({ children }) {
    const [pane, setPane] = useState(PANES.APP);

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
