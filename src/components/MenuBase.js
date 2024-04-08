import React, { useEffect, useRef } from 'react';

export default function MenuBase({activeItem, items, itemFn, setActiveItem, selectItem }) {
    const activeItemRef = useRef(activeItem);
    const selectItemRef = useRef(selectItem);
    const itemsRef = useRef(items);
    const activeIndexRef = useRef(0);

    useEffect(() => {
        if (activeItemRef.current !== activeItem) {
            activeItemRef.current = activeItem;
            const index = itemsRef.current.findIndex((item) => {
                return item === activeItem;
            });
            activeIndexRef.current = index;
        }
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

            let nextIndex = activeIndexRef.current;
            if (code === "ArrowUp") {
                nextIndex = Math.max(nextIndex - 1, 0);
            } else if (code === "ArrowDown") {
                nextIndex = Math.min(nextIndex + 1, itemsRef.current.length-1);
            } else if (code === "Enter") {
                selectItemRef.current();
            }

            if (setActiveItem) {
                setActiveItem(itemsRef.current[nextIndex]);
            }
            activeItemRef.current = itemsRef.current[nextIndex];
            activeIndexRef.current = nextIndex;
        }
        window.addEventListener("keyup", listener);

        return () => {
            window.removeEventListener("keyup", listener);
        }
    }, []);

    return <div>
        {items.map((item, index) => {
            return <div key={`${item}_${index}`}>
                {itemFn(item, activeIndexRef.current === index)}
            </div>
        })}
    </div>
}