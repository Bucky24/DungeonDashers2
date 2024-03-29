import React, { useEffect, useState } from 'react';
import MenuBase from './MenuBase';

export default function StandardMenu({ items, onSelect }) {
    const [activeItem, setActiveItem] = useState();

    useEffect(() => {
        setActiveItem(items[0]);
    }, [items]);
    return <div style={{ width: 300 }}>
        <MenuBase
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            items={items}
            itemFn={(item, active) => {
                return <div style={{
                    width: '100%',
                    height: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: active ? '#f00' : '#fff',
                }}>
                    {item}
                </div>
            }}
            selectItem={() => {
                onSelect(activeItem);
            }}
        />
    </div>
}