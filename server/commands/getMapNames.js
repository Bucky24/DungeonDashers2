const path = require("path");
const fs = require("fs");

const { directories, getAllInDirectories } = require("../utils");

module.exports = function(params) {
    let files = getAllInDirectories(directories.maps.load);

    if (params.save) {
        files = getAllInDirectories(directories.maps.save);
    }

    return {
        success: true,
        maps: files.map(({ name }) => name ),
    };
}