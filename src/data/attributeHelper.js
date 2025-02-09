import { getCharacters, getEquipment } from './moduleData';

function getStatsFromEquipment(stats, equipment) {
    const equipsData = getEquipment();
    const equipData = equipsData[equipment.type];
    const newStats = {...stats};

    for (const stat of equipData.stats) {
        const newValue = stat.value.data;
        if(stat.operator === 'INCREASE') {
            newStats[stat.stat] += newValue;
        } else if(stat.operator === 'DECREASE') {
            newStats[stat.stat] -= newValue;
        }
    }

    return newStats;
}

function getCharacterStats(character) {
    const charsData = getCharacters();
    const charData = charsData[character.type];

    const initialStats = {
        maxHP: charData.maxHP,
        maxActionPoints: charData.actionPoints,
    };

    console.log(initialStats, character.slots);

    let currentStats = {...initialStats};
    if (character.slots) {
        for (const slot of character.slots) {
            currentStats = getStatsFromEquipment(currentStats, slot);
        }
    }

    return currentStats;
}

export function getMaxHp(character) {
    const stats = getCharacterStats(character);
    return stats.maxHP;
}

export function getHp(character) {
    if (character.hp) {
        return character.hp;
    }

    return getMaxHp(character);
}

export function getMaxActionPoints(character) {
    const stats = getCharacterStats(character);
    return stats.maxActionPoints;
}

export function getActionPoints(character) {
    if (character.actionPoints) {
        return character.actionPoints;
    }

    return getMaxActionPoints(character);
}