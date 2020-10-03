const Joi = require('joi');

const mapV1 = Joi.object({
    version: Joi.number().integer().required(),
    width: Joi.number().integer().required(),
    height: Joi.number().integer().required(),
    tiles: Joi.array().items(Joi.object({
        tile: Joi.string().required(),
        x: Joi.number().required(),
        y: Joi.number().required(),
    })).required(),
    characters: Joi.array().items(Joi.object({
        ident: Joi.string().required(),
        x: Joi.number().integer().required(),
        y: Joi.number().integer().required(),
        equipment: Joi.array().items(Joi.object({
            type: Joi.string().required(),
        })),
    })).required(),
    objects: Joi.array().items(Joi.object({
        type: Joi.string().required(),
        id: Joi.number().integer().required(),
        x: Joi.number().integer().required(),
        y: Joi.number().integer().required(),
        contains: Joi.array().items(Joi.object({
            type: Joi.string().valid("currency", "equipment").required(),
            data: Joi.object({
                type: Joi.string().required(),
                amount: Joi.number(),
            }),
        })),
    })).required(),
    enemies: Joi.array().items(Joi.object({
        type: Joi.string().required(),
        id: Joi.number().integer().required(),
        doorTrigger: Joi.number().integer(),
        x: Joi.number().integer().required(),
        y: Joi.number().integer().required(),
    })),
    triggers: Joi.array().items(Joi.object({
        conditions: Joi.array().items(Joi.object({
            type: Joi.string().required(),
            data: Joi.object().required(),
        })),
        effects: Joi.array().items(Joi.object({
            type: Joi.string().required(),
            data: Joi.object().required()
        })),
    })),
})

export default (value) => {
    const result = mapV1.validate(value);

    if (result.error) {
        console.log(result.error);
        throw new Error(result.error);
    }

    return result.value;
}
