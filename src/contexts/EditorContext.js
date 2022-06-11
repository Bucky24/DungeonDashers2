import React, { useState } from 'react';

const EditorContext = React.createContext({});
export default EditorContext;

export function EditorProvider({ children}) {
    // nothing to load for now
    const [loaded, setLoaded] = useState(true);

    const value = {
        loaded,
        /*loadMap: async (map) => {

        },*/
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}