import React, { useContext, useEffect, useRef } from 'react';

import UIContext, { UI_MODE } from '../contexts/UIContext';
import GameContext from '../contexts/GameContext';
import DialogBase from './DialogBase';

export default function VictoryDialog() {
    return <DialogBase>
        <h3>Victory!</h3>
    </DialogBase>
}