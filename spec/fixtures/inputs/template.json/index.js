'use babel';

const fs = require('fs');
const path = require('path');

module.exports = Object.assign(
    {},
    require('./collections'),
    require('./generation'),
    require('./parse'),
    require('./transformation'),
);
