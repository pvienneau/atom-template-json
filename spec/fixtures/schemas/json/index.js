const fs = require('fs');
const path = require('path');

module.exports = {
    valid: fs.readFileSync(path.resolve(__dirname, 'valid.json')).toString(),
    validBoolean: fs.readFileSync(path.resolve(__dirname, 'validBoolean.json')).toString(),
};
