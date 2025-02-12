const path = require("path");
const fs = require("fs");

const { directories, locateInDirectoriesForSave } = require("../utils");

module.exports = function({ campaign, data }) {
    const file = locateInDirectoriesForSave(`${campaign}__CAMPAIGN.json`, directories.saves.save);

    if (!file) {
        return {
            success: false,
            message: "Unable to find appropriate save location",
        };
    }

    data.version = 2;

    fs.writeFileSync(file, JSON.stringify(data, null, 4));
}