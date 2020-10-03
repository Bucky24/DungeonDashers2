const Joi = require('joi');

const versionedObject = Joi.object({
    version: Joi.number().required(),
});