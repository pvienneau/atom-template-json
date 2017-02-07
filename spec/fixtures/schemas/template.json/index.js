const fs = require('fs');
const path = require('path');

module.exports = {
    valid: fs.readFileSync(path.resolve(__dirname, 'valid.json')).toString(),
    validGenerationFunction: fs.readFileSync(path.resolve(__dirname, 'validGenerationFunction.json')).toString(),
    validTransformFunction: fs.readFileSync(path.resolve(__dirname, 'validTransformFunction.json')).toString(),
};
