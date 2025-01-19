import React from 'react';
import classNames from 'classnames';

import styles from './SidebarNav.css';

export default function SidebarNav({ items, activeItem, setActiveItem, onNew }) {
    return <aside style={{ flexShrink: 0, flexBasis: 200, marginRight: 20 }}>
        {items.map((key) => {
            return <div
                key={`item_${key}`}
                className={classNames(
                    activeItem === key && styles.active,
                )}
                onClick={() => setActiveItem(key)}
            >{key}</div>
        })}
        <button onClick={() => {
            const name = window.prompt("Enter name");
            onNew(name || 'unnamed');
        }}>Add</button>
    </aside>
}