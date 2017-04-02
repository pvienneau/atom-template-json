const fs = require('fs');
const path = require('path');

module.exports = {
    functionsPersistence: fs.readFileSync(path.resolve(__dirname, 'functionsPersistence.template.json')).toString(),
};
