import React, { useEffect, useRef } from 'react';

export default function DialogBase({ children }) {
    const dialogRef = useRef();

    useEffect(() => {
        dialogRef.current.show();
    }, [dialogRef.current]);

    return <dialog style={{ top: 40 }} ref={dialogRef}>
        {children}
    </dialog>
}