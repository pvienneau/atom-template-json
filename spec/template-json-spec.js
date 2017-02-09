const Schema = require('extensible-compiler').default;
const jsonTMap = require('../lib/json-map.js');
const GenerationActions = require('../lib/generation-actions.js');
const inputs = require('./fixtures/inputs');
const schemas = require('./fixtures/schemas');
const { isValidJSON } = require('./fixtures/jasmine/matchers');
const prettydiff = require('../bin/prettydiff');

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
            //expect(schema.eatenInput).toBe(JSONSchemas.valid);
        });

        it('should pass valid JSON with boolean value `false`', () => {
            schema.input = JSONInputs.validBoolean;
            const result = schema.parse();

            expect(result).toBeTruthy();
            expect(isValidJSON(schema.eatenInput)).toBeTruthy();
            //expect(schema.eatenInput).toBe(JSONSchemas.validBoolean);
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
            //expect(isSameStructure(schema.eatenInput, templateJSONSchemas.validGenerationFunction)).toBeTruthy();
        });

        it('should pass valid Template JSON value with transform function', () => {
            schema.input = templateJSONInputs.validTransformFunction;
            const result = schema.parse();

            expect(result).toBeTruthy();
            expect(isValidJSON(schema.eatenInput)).toBeTruthy();
            //expect(isSameStructure(schema.eatenInput, templateJSONSchemas.validTransformFunction)).toBeTruthy();
        });

        it('should pass valid Template JSON value with both generation and transform functions', () => {
            schema.input = templateJSONInputs.valid;
            const result = schema.parse();

            expect(result).toBeTruthy();
            expect(isValidJSON(schema.eatenInput)).toBeTruthy();
            //expect(isSameStructure(schema.eatenInput)).toBeTruthy();
        });
    });

    describe('actions', () => {
        let actions;

        beforeEach(() => {
            actions = new GenerationActions();
        });

        describe('boolean()', () => {
            it('should return a stringified boolean value', () => {
                expect(actions.call('boolean')).toMatch(/^(true|false)$/gi);
            });
        });

        describe('email()', () => {
            it('should return an email', () => {
                expect(actions.call('email')).toMatch(/^"[a-z]{4,}.[a-z]{4,}.[a-z]{4,}\@[a-z]{4,}\.[a-z]+"$/g);
            });
        });

        describe('guid()', () => {
            it('should return an integer', () => {
                expect(typeof actions.call('guid')).toBe('number');
            });

            it('should not reset count when _resetId() is called', () => {
                expect(actions.call('guid')).toBe(1);

                actions._resetId();

                expect(actions.call('guid')).toBe(2);
            });
        });

        describe('random()', () => {
            const fragileRandomTester = (min, max) => {
                let computedMin;// = max - ((max-min)/2);
                let computedMax;// = max - ((max-min)/2);

                for(let kk = 0; kk < 200; kk++){
                    const result = actions.call('random', min, max);

                    if(computedMin === undefined || result < computedMin) computedMin = result;
                    if(computedMax === undefined || result > computedMax) computedMax = result;
                }

                return {
                    min: computedMin,
                    max: computedMax,
                };
            }

            it('should generate random numbers between the provided boundaries', () => {
                const expectedMin = 0;
                const expectedMax = 11;

                const {
                    min,
                    max
                } = fragileRandomTester(expectedMin, expectedMax);

                expect(min).toBe(expectedMin);
                expect(max).toBe(expectedMax);
            });

            it('should not accept negative numbers as a minimum value', () => {
                const expectedMin = 0;

                const { min } = fragileRandomTester(expectedMin-1);

                expect(min).toBe(expectedMin);
            });

            it('should recalculate max boundary to the same value as the min boundary if it is smaller than it', () => {
                const expectedMin = 5;
                const expectedMax = expectedMin - 1;

                const {
                    min,
                    max
                } = fragileRandomTester(expectedMin, expectedMax);

                expect(min).toBe(expectedMin);
                expect(max).toBe(expectedMin);
            });
        });

        describe('timestamp()', () => {
            it('should return an integer', () => {
                expect(typeof actions.call('timestamp')).toBe('number');
            });
        });

        describe('string()', () => {
            it('should return a string', () => {
                expect(typeof actions.call('string')).toBe('string');
            });

            it('should return a string of the specified length', () => {
                const expectedLength = 22;

                expect(actions.call('string', expectedLength).length).toBe(expectedLength+2); //+2 for double quotes
            });
        });

        describe('id()', () => {
            it('should return an integer', () => {
                expect(typeof actions.call('id')).toBe('number');
            });

            it('should reset count when _resetId() is called', () => {
                expect(actions.call('id')).toBe(1);

                actions._resetId();

                expect(actions.call('id')).toBe(1);
            });
        });

        describe('name()', () => {
            it('should return a string of two words', () => {
                expect(actions.call('name')).toMatch(/^\w+\s\w+$/ig);
            });
        });
    });
});
