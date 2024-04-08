const path = require("path");
const fs = require("fs");

const { directories, getAllInDirectories } = require("../utils");

module.exports = function() {
    const files = getAllInDirectories(directories.maps.load);

    return {
        success: true,
        maps: files.map(({ name }) => name ),
    };
}