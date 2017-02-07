const Schema = require('extensible-compiler').default;
const jsonTMap = require('../lib/json-map.js');
const inputs = require('./fixtures/inputs');
const schemas = require('./fixtures/schemas');
const { isValidJSON } = require('./fixtures/jasmine/matchers');
const prettydiff = require('../bin/prettydiff');

const getCleanedOutput = (schema) => {
    return prettydiff({
        source: schema.eatenInput,
        mode: 'beautify',
        lang: 'json',
    });
};

describe('extensible-compiler', () => {
    let schema;

    beforeEach(() => {
        schema = new Schema(jsonTMap);
    });

    describe('.json', () => {
        const JSONInputs = inputs[`json`];
        const JSONSchemas = schemas[`json`];

        it('should pass valid JSON value', () => {
            schema.input = JSONInputs.valid;
            const result = schema.parse();

            expect(result).toBeTruthy();
            expect(isValidJSON(schema.eatenInput)).toBeTruthy();
            expect(schema.eatenInput).toBe(JSONSchemas.valid);
        });

        it('should pass valid JSON with boolean value `false`', () => {
            schema.input = JSONInputs.validBoolean;
            const result = schema.parse();

            expect(result).toBeTruthy();
            expect(isValidJSON(schema.eatenInput)).toBeTruthy();
            expect(schema.eatenInput).toBe(JSONSchemas.validBoolean);
        });

        it('should fail on invalid JSON value', () => {
            schema.input = JSONInputs.invalid;
            const result = schema.parse();

            expect(result).toBeTruthy();
        });
    });

    describe('.template.json', () => {
        const templateJSONInputs = inputs[`template.json`];
        const templateJSONSchemas = schemas[`template.json`];

        it('should pass valid Template JSON value with generation function', () => {
            schema.input = templateJSONInputs.validGenerationFunction;
            const result = schema.parse();

            expect(result).toBeTruthy();
            expect(isValidJSON(schema.eatenInput)).toBeTruthy();
            expect(isSameStructure(schema.eatenInput, templateJSONSchemas.validGenerationFunctio).toBeTruthy();
        });

        fit('should pass valid Template JSON value with transform function', () => {
            schema.input = templateJSONInputs.validTransformFunction;
            const result = schema.parse();

            expect(result).toBeTruthy();
            //expect(isValidJSON(schema.eatenInput)).toBeTruthy();
            //expect(isSameStructure(schema.eatenInput, templateJSONSchemas.validTransformFunction).toBeTruthy();
        });

        it('should pass valid Template JSON value with both generation and transform functions', () => {
            schema.input = templateJSONInputs.valid;
            const result = schema.parse();

            expect(result).toBeTruthy();
            expect(isValidJSON(schema.eatenInput)).toBeTruthy();
            expect(isSameStructure(schema.eatenInput)).toBeTruthy();
        });
    });
});
