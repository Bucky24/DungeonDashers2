import React, { useState } from 'react';

function TextField({ value, setValue }) {
    return (
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
    );
}

export default function() {
    const [value, setValue] = useState('');

    return {
        value,
        element: (<TextField value={value} setValue={setValue} />)
    };
}
