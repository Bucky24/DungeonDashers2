import React, { useState } from 'react';

export default function TextField({ value: initialValue, onBlur }) {
    const [value, setValue] = useState(initialValue);

    return (
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} onBlur={() => {
            onBlur(value);
        }} />
    );
}