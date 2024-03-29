const {
    directories,
    locateInDirectories,
    getJsonFile,
    getImageSlug,
} = require("../utils");

module.exports = function({ campaign }) {
    const file = locateInDirectories(`${campaign}.json`, directories.campaign);

    if (!file) {
        return {
            success: false,
            message: "Can't locate campaign in any directory",
        };
    }

    const data = getJsonFile(file);

    // get path to background
    data.background.image = getImageSlug('campaign', data.background.image);

    return {
        success: true,
        campaign: data,
    };
}