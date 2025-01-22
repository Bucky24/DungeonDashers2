import React, { use, useEffect, useState } from 'react';

const SearchContext = React.createContext({});
export default SearchContext;

export function SearchProvider({ children }) {
    const [search, setSearch] = useState({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const search = new URLSearchParams(window.location.search);
        const newSearch = {};
        for (const [key, value] of search.entries()) {
            newSearch[key] = value;
        }
        setSearch(newSearch);
        setLoaded(true);
    }, []);

    const values = {
        search,
        loaded,
        changeSearch: (key, value) => {
            setSearch((search) => {
                const newSearch = {...search};
                if (value === null || value === undefined) {
                    delete newSearch[key];
                } else {
                    newSearch[key] = value;
                }
                window.history.pushState({}, '', `?${new URLSearchParams(newSearch).toString()}`);

                return newSearch;
            });
        },
    };

    return (
        <SearchContext.Provider value={values}>
            {children}
        </SearchContext.Provider>
    )
};