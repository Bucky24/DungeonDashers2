const path = require("path");
const fs = require("fs");

const { directories, locateInDirectories, getJsonFile } = require("../utils");

module.exports = function({ campaign }) {
    const file = locateInDirectories(`${campaign}__CAMPAIGN.json`, directories.saves.load);

    if (!file) {
        return {
            success: false,
            message: "Can't locate save in any directory",
        };
    }

    const data = getJsonFile(file);

    return {
        success: true,
        data,
    };
}