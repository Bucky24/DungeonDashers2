import useMoveActiveCharacter from "./useMoveActiveCharacter";
import { ACTION_MAP } from '../../contexts/SettingsContext';

export default function takeAction() {
    const moveActiveCharacter = useMoveActiveCharacter();

    const actionMap = {
        [ACTION_MAP.MOVE_LEFT]: () => moveActiveCharacter(-1, 0)
    }

    return (action) => {
        if (!actionMap[action]) {
            console.error(`Unhandled action ${action}`);
            return;
        }

        actionMap[action]();
    }
}