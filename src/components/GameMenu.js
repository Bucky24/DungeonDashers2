import React, { useContext } from 'react';
import classNames from 'classnames';

import styles from './GameMenu.css';
import UIContext, { MENU_ITEMS } from '../contexts/UIContext';

export default function GameMenu() {
    const { activeMenuItem } = useContext(UIContext);

    return <div>
        {MENU_ITEMS.map((item, index) => {
            return <div key={item} className={classNames(
                styles.button,
                activeMenuItem === index && styles.active,
            )}>{item}</div>
        })}
    </div>
}