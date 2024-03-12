import React, { useState } from 'react';

export default function TabBar({ tabs, children, defaultTab }) {
    const [tab, setTab] = useState(defaultTab);

    if (!Array.isArray(children)) {
        children = [children];
    }

    const activeIndex = tabs.indexOf(tab);
    const activeChild = children[activeIndex];

    console.log(tab, activeIndex, activeChild, children);

    return <>
        <nav>
            {tabs.map((tab) => {
                return <button key={`tab_${tab}`} onClick={() => setTab(tab)}>{tab}</button>
            })}
        </nav>
        {activeChild}
    </>
}