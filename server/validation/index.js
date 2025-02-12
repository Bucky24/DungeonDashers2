const validators = require("./validators");

async function validateData(type, data) {
    if (!validators[type]) {
        console.error(`No validator for type ${type}`);
        return;
    }

    if (!data.version) {
        console.error("Data object is missing version");
        return;
    }

    if (!validators[type][data.version]) {
        console.error(`Validator for type ${type} has no validator for version ${data.version}`);
        return;
    }

    const validator = await validators[type][data.version];

    // validator should throw errors if bad validation
    return validator(data);
}

module.exports = validateData;