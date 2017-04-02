const fs = require('fs');
const path = require('path');

module.exports = {
    validTransformFunction: fs.readFileSync(path.resolve(__dirname, 'validTransformFunction.template.json')).toString(),
};
