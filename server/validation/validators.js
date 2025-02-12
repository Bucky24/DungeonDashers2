const { validateSavedGame, validateSavedCampaign} = require('./dataValidators/saveValidatorV2.js');

module.exports = {
    save: {
        2: validateSavedGame,
    },
    campaign: {
        2: validateSavedCampaign,
    },
};