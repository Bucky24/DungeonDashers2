const validators = require("./validators");

async function validateData(type, data) {
    if (!validators[type]) {
        throw new Error(`No validator for type ${type}`);
    }

    if (!data.version) {
        throw new Error(`Data object ${type} is missing version`);
    }

    if (!validators[type][data.version]) {
        throw new Error(`Validator for type ${type} has no validator for version ${data.version}`);
        return;
    }

    const validator = await validators[type][data.version];

    // validator should throw errors if bad validation
    return validator(data);
}

module.exports = validateData;