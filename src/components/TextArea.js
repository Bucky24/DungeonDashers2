import React, { useEffect, useState } from 'react';

export default function TextArea({ value: initialValue, onBlur }) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (value !== initialValue) {
            setValue(initialValue);
        }
    }, [initialValue]);

    return (
        <textarea
            onChange={(e) => {
                setValue(e.target.value);
            }}
            value={value}
            onBlur={() => {
                onBlur(value);
            }}
        ></textarea>
    );
}