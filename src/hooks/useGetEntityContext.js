import { useContext } from 'react';

import ModuleContext from '../contexts/ModuleContext';
import GameContext from '../contexts/GameContext';

function useGetObjectContext() {
    const { objects } = useContext(ModuleContext);
    const { setObjectProperty } = useContext(GameContext);

    // this should be the object from GameContext
    return (objectData) => {
        const moduleData = objects[objectData.type] || {};
        return {
            state: objectData.state || moduleData.defaultState,
            flags: objectData.flags || [],
            getState: function() {
                return this.state;
            },
            setState: function(newState) {
                setObjectProperty(objectData.id, "state", newState);
                this.state = newState;
            },
            setFlag: function(flag) {
                if (this.flags.includes(flag)) {
                    return;
                }

                this.flags.push(flag);

                setObjectProperty(objectData.id, "flags", [...this.flags]);
            }
        };
    }
}

function useGetCharacterContext() {
    // this should be the object from GameContext
    return (characterData) => {
        return {

        };
    }
}

export default function useGetEntityContext() {
    const getObjectContext = useGetObjectContext();
    const getCharacterContext = useGetCharacterContext();

    return (entity) => {
        if (entity.type === "object") {
            return getObjectContext(entity.entity);
        } else if (entity.type === "character") {
            return getCharacterContext(entity.entity);
        }
    }
}
