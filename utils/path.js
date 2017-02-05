module.exports = {};
module.exports.getFileExtension = (path) => {
    const pIndex = path.indexOf('.');
    return path.substr(pIndex);
};
module.exports.isFileExtension = (path, extension) => {
    return module.exports.getFileExtension(path) === extension;
};
