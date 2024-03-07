import React, { useState } from 'react';

const UIContext = React.createContext({});
export default UIContext;

export function UIProvider({ children }) {
    const value = {};

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
}
