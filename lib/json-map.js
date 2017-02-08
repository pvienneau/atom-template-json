'use babel';

import ActionManager from './action-manager';
import GenerationActions from './generation-actions.js';

let actions = new GenerationActions();
let actionManager = new ActionManager();

const clearEatenInput = schema => {schema.eatenInput = ''};
const transformFunctionCallback = schema => {
    const { eatenInput, rawInput, input } = schema;

    if (!actionManager.hasAction('repeat')) return false;

    const action = actionManager.getAction();

    const repeatCount = action.arguments[0] || 1;

    //verification
    if (!schema.nonEmptyValue()) return false;

    //resets
    actions._resetId();
    schema.eatenInput = '';

    //transforms
    for(let ii = 0; ii < repeatCount; ii++){
        schema.input = input;
        schema.nonEmptyValue(schema => {
            schema.eatenInput += (ii < repeatCount-1)?',':'';
        });
    }

    return true;
}
const generationFunctionCallback = schema => {
    const action = actionManager.getAction();

    const result = actions.call(action.name, ...action.arguments);

    if(result === false) return false;

    schema.eatenInput = result;

    return true;
}

const templateJSONMap = {
    main: (schema) => schema.array() || schema.object(),
    nonEmptyValue: (schema) => schema.array() || schema.object() || schema.literal(),
    value: (schema) => schema.transformationFunction(transformFunctionCallback) || schema.generationFunction(generationFunctionCallback) || schema.nonEmptyValue() || schema.empty(),
    object: (schema) => schema.curlyLeft() && schema.objectValue() && schema.curlyRight(),
    objectValue: (schema) => (schema.strictString() && schema.colon() && schema.value() && ((schema.comma() && schema.objectValue())|| schema.empty())) || schema.empty(),
    array: (schema) => schema.bracketLeft() && schema.arrayValue() && schema.bracketRight(),
    arrayValue: (schema) => schema.value() && ((schema.comma() && schema.arrayValue()) || schema.empty()),
    literal: (schema) => {return (schema.integer() || schema.string() || schema.boolean() || schema.null())},
    integer: (schema) => '-?[0-9]+(\\.[0-9]*)?(e[0-9]+)?',
    strictString: (schema) => '"(\\\\"|[^"])*"',
    string: (schema) => '"(\\\\(?:[bfnrt\\\\\/"]|u[0-9a-f])|[^"\\\\])*"',
    boolean: (schema) => '(true|false)',
    null: () => 'null',
    curlyLeft: () => '{',
    curlyRight: () => '}',
    bracketLeft: () => '\\[',
    bracketRight: () => ']',
    comma: () => ',',
    colon: () => ':',
    empty: () => true,

    //---------
    doubleCurlyLeft: (schema) => schema.curlyLeft() && schema.curlyLeft(),
    doubleCurlyRight: (schema) => schema.curlyRight() && schema.curlyRight(),
    transformationFunction: (schema) => schema.doubleCurlyLeft(clearEatenInput) && schema.function((schema, action, ...args) => {actionManager.setAction(action, ...args)}) && schema.doubleCurlyRight(clearEatenInput),
    generationFunction: (schema) => schema.doubleCurlyLeft(clearEatenInput) && schema.function((schema, action, ...args) => {actionManager.setAction(action, ...args)}) && schema.doubleCurlyRight(clearEatenInput),
    function: () => '([a-z][a-z0-9_]*)\\(([0-9]*)(?:\\s*,\\s*([0-9]*))*\\)',
};

export default templateJSONMap;
