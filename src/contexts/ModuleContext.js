import React, { useState } from 'react';

import Coms from '../utils/coms';

const ModuleContext = React.createContext({});
export default ModuleContext;

export function ModuleProvider({ children }) {
    const [loaded, setLoaded] = useState(false);

    const value = {
        loadModules: (names) => {
            setLoaded(false);

            const promises = names.map(async (name) => {
                const result = await Coms.send('getModule', { name });

                if (!result.success) {
                    console.error(result.message);
                    return;
                }

                console.log(result);
            });

            Promise.all(promises).then(() => {
                setLoaded(true);
            });
        },
        loaded,
    };

    return (
        <ModuleContext.Provider value={value}>
            {children}
        </ModuleContext.Provider>
    );
}