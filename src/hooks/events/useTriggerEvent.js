import { EVENTS } from '../../contexts/GameContext';

import useHandleCollide from './useHandleCollide';

export default function useTriggerEvent() {
    const handleCollide = useHandleCollide();

    const handlers = {
        [EVENTS.COLLIDE]: handleCollide,
    }

    return (event, data = {}) => {
        if (!handlers) {
            console.error(`Unknown event triggered: ${event}`);
            return;
        }

        handlers[event](data);
    }
}