const path = require("path");
const fs = require("fs");

const { directories, locateInDirectories, getJsonFile } = require("../utils");
const validateData = require("../validation");

module.exports = async function({ campaign }) {
    const file = locateInDirectories(`${campaign}__CAMPAIGN.json`, directories.saves.load);

    if (!file) {
        return {
            success: false,
            message: "Can't locate save in any directory",
        };
    }

    const data = getJsonFile(file);

    try {
        const validatedData = await validateData("campaign", data);

        return {
            success: true,
            data: validatedData,
        };
    } catch (err) {
        return {
            success: false,
            error: err.message,
        };
    }
}