module.exports = {
    hasFileExtension: (path, extension) => {
        let str = path;
        if(extension.charAt(0) == 0) str = str.substr(1);

        return path.endsWith(extension);
    },
};
