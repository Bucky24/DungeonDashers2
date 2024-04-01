import React, { useEffect, useRef } from 'react';

export default function MenuBase({activeItem, items, itemFn, setActiveItem, selectItem }) {
    const activeItemRef = useRef(activeItem);
    const selectItemRef = useRef(selectItem);
    const itemsRef = useRef(items);

    useEffect(() => {
        activeItemRef.current = activeItem;
    }, [activeItem]);

    useEffect(() => {
        selectItemRef.current = selectItem;
    }, [selectItem]);

    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    useEffect(() => {
        const listener = (event) => {
            const { code } = event;

            const index = itemsRef.current.findIndex((item) => {
                return item === activeItemRef.current;
            });
            let nextIndex = index;
            if (code === "ArrowUp") {
                nextIndex = Math.max(index - 1, 0);
            } else if (code === "ArrowDown") {
                nextIndex = Math.min(index + 1, itemsRef.current.length-1);
            } else if (code === "Enter") {
                selectItemRef.current();
            }

            if (setActiveItem) {
                setActiveItem(itemsRef.current[nextIndex]);
            }
        }
        window.addEventListener("keyup", listener);

        return () => {
            window.removeEventListener("keyup", listener);
        }
    }, []);

    return <div>
        {items.map((item, index) => {
            return <div key={item}>
                {itemFn(item, activeItem === item)}
            </div>
        })}
    </div>
}