const fs = require('fs');
const path = require('path');

module.exports = {
    validCollection: fs.readFileSync(path.resolve(__dirname, 'validCollection.template.json')).toString(),
};
