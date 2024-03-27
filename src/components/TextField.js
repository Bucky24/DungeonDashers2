import React, { useEffect, useState } from 'react';

export default function TextField({ value: initialValue, onBlur }) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (value !== initialValue) {
            setValue(initialValue);
        }
    }, [initialValue]);

    return (
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} onBlur={() => {
            onBlur(value);
        }} />
    );
}