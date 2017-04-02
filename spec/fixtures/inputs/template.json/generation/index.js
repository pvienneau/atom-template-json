const fs = require('fs');
const path = require('path');

module.exports = {
    validGenerationFunction: fs.readFileSync(path.resolve(__dirname, 'validGenerationFunction.template.json')).toString(),
    functionsPersistence: fs.readFileSync(path.resolve(__dirname, 'functionsPersistence.template.json')).toString(),
};

console.log(module.exports);
