const fs = require('fs');
const path = require('path');

module.exports = {
    valid: fs.readFileSync(path.resolve(__dirname, 'valid.template.json')).toString(),
    validBoolean: fs.readFileSync(path.resolve(__dirname, 'validBoolean.template.json')).toString(),
    invalid: fs.readFileSync(path.resolve(__dirname, 'invalid.template.json')).toString(),
};
