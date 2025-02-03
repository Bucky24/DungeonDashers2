import React, { useContext } from 'react';

import DialogBase from './DialogBase';
import UIContext, { UI_MODE } from '../contexts/UIContext';

export default function EquipmentDialog() {
    const { setMode } = useContext(UIContext);

    return <DialogBase onClose={() => {
        setMode(UI_MODE.GAME);
    }}>
        <div>
            <div>
                Unassigned equipment
            </div>
            <div>
                Assigned equipment
            </div>
        </div>
    </DialogBase>
}