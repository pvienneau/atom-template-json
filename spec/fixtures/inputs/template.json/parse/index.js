const fs = require('fs');
const path = require('path');

module.exports = {
    valid: fs.readFileSync(path.resolve(__dirname, 'valid.template.json')).toString(),
};
