'use babel';

import ActionManager from './action';
import moment from 'moment';

let actionManager = new ActionManager();
let id = 1;
let guid = 1;

const clearEatenInput = schema => {schema.eatenInput = ''};
const transformFunctionCallback = schema => {
    const { eatenInput, rawInput, input } = schema;

    if (!actionManager.hasAction('repeat')) return false;

    const action = actionManager.getAction();

    const repeatCount = action.arguments[0] || 1;

    //verification
    if (!schema.nonEmptyValue()) return false;

    //resets
    id = 1;
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
    const string_value = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque dolor lorem. Mauris vulputate dolor id libero elementum fermentum. Sed ac metus ut nisl aliquam rhoncus. Sed et mattis leo. Phasellus pharetra volutpat tempus. Vestibulum pretium lacus vitae fermentum gravida. Sed ut viverra turpis. Vestibulum semper efficitur augue, sed consectetur odio volutpat ut. In eget sollicitudin odio. Quisque cursus nisl id nisl eleifend varius. Proin et vestibulum eros, consequat sagittis nibh. Phasellus id porttitor mauris. Integer nulla arcu, interdum eget sagittis posuere, aliquam vel augue. Mauris luctus elementum est, finibus semper nunc. Nunc lorem mauris, tincidunt nec tellus quis, condimentum.";
    const action = actionManager.getAction();

    const fnExec = (action, ...args) => {
        console.log(action);
        console.log(args[0]);
        console.log(args[1]);

        switch(action){
            case 'string':
                return `"${string_value.substr(0, args[0])}"`;
            case 'guid':
                return guid++;
            case 'id':
                return id++;
            case 'rand':
                return Math.floor(Math.random() * (args[1] - args[0] + 1)) + args[0];
            case 'rand_datetime':
                const max = moment().format('x');
                const min = max - 604800000;

                return Math.floor(Math.random() * (max - min + 1)) + min
        };

        return false;
    };

    const result = fnExec(action.name, ...action.arguments);

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
