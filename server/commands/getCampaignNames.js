const path = require("path");
const fs = require("fs");

const { directories, getAllInDirectories } = require("../utils");

module.exports = function() {
    const files = getAllInDirectories(directories.campaign);

    return {
        success: true,
        campaigns: files.map(({ name }) => name ),
    };
}