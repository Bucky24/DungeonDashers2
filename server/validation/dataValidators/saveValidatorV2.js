const { object, string, array, number, mixed } = require("yup");

const saveGameSchema = object({
    type: string().required().oneOf(["game"]),
    map: string().required(),
    campaign: string().nullable(),
    characters: array(object({
        type: string().required(),
        x: number().required(),
        y: number().required(),
        id: number().required(),
        flags: array(string()).optional(),
    })),
    enemies: array(object({
        type: string().required(),
        x: number().required(),
        y: number().required(),
        id: number().required(),
        flags: array(string()),
        data: mixed(),
    })),
    objects: array(object({
        type: string().required(),
        x: number().required(),
        y: number().required(),
        id: number().required(),
        data: mixed(),
    })),
    gameData: object({
        activeCharacterIndex: number().required(),
        activeEnemyIndex: number().required(),
        gold: number().required(),
        combatTurn: string().required(),
        objectId: number().required(),
    }).required(),
});

const saveCampaignSchema = object({
    type: string().required().oneOf(['campaign']),
    maps: array(string()),
    equipment: array(object({
        type: string().required(),
        slot: string().required(),
    })),
    characters: array(object({
        type: string().required(),
        slots: array(object({
            type: string().required(),
            slot: string().required(),
        })),
    })),
});

module.exports = {
    validateSavedGame: async function(data) {
        return await saveGameSchema.validate(data);
    },
    validateSavedCampaign: async function(data) {
        return await saveCampaignSchema.validate(data);
    }
};