const Schema = require('extensible-compiler').default;
const jsonTMap = require('../lib/json-map.js');
const inputs = require('./fixtures/inputs');
const schemas = require('./fixtures/schemas');
const prettydiff = require('../bin/prettydiff');

const getCleanedOutput = (schema) => {
    return prettydiff({
        source: schema.eatenInput,
        mode: 'beautify',
        lang: 'json',
    });
}

describe('extensible-compiler', () => {
    let schema;

    beforeEach(() => {
        schema = new Schema(jsonTMap);
    });

    describe('.json', () => {
        it('should pass valid JSON value', () => {
            schema.input = inputs.json.valid;
            const result = schema.parse();

            expect(result).toBeTruthy();
            expect(schema.eatenInput).toBe(schemas.json.valid);
        });

        it('should pass valid JSON with boolean value `false`', () => {
            schema.input = inputs.json.validBoolean;
            const result = schema.parse();

            expect(result).toBeTruthy();
            expect(schema.eatenInput).toBe(schemas.json.validBoolean);
        });

        it('should fail on invalid JSON value', () => {
            schema.input = inputs.json.invalid;
            const result = schema.parse();

            expect(result).toBeTruthy();
        });
    });

    describe('.template.json', () => {

    });
});
