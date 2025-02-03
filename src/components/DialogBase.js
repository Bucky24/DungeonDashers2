import React, { useEffect, useRef } from 'react';

export default function DialogBase({ children, onClose }) {
    const dialogRef = useRef();

    useEffect(() => {
        dialogRef.current.show();
    }, [dialogRef.current]);

    return <dialog style={{ top: 40 }} ref={dialogRef}>
        <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: 10,
            cursor: 'pointer',
        }} onClick={() => {
            if (onClose) onClose();
        }}>X</div>
        <div style={{
            paddingTop: 10,
        }}>
            {children}
        </div>
    </dialog>
}