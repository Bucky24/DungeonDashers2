import React, { useEffect, useState } from 'react';

export default function TabBar({ tabs, children, initialTab, onChange }) {
    const [tab, setTab] = useState(initialTab);

    if (!Array.isArray(children)) {
        children = [children];
    }

    useEffect(() => {
        if (initialTab !== tab) {
            setTab(initialTab);
        }
    }, [initialTab]);

    const activeIndex = tabs.indexOf(tab);
    const activeChild = children[activeIndex];

    return <>
        <nav>
            {tabs.map((tab) => {
                return <button key={`tab_${tab}`} onClick={() => {
                    setTab(tab);
                    if (onChange) onChange(tab);
                }}>{tab}</button>
            })}
        </nav>
        {activeChild}
    </>
}