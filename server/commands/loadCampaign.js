const {
    directories,
    locateInDirectories,
    getJsonFile,
    getImageSlug,
} = require("../utils");

module.exports = function({ campaign }) {
    const file = locateInDirectories(`${campaign}.json`, directories.campaigns.load);

    if (!file) {
        return {
            success: false,
            message: "Can't locate campaign in any directory",
        };
    }

    const data = getJsonFile(file);

    // get path to background
    data.background.originalImage = data.background.image;
    data.background.image = getImageSlug('campaigns', data.background.image);

    return {
        success: true,
        campaign: data,
    };
}