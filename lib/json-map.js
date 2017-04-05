'use babel';

import ActionManager from './action-manager';
import GenerationActions from './generation-actions.js';

let actions = new GenerationActions();
let actionManager = new ActionManager();

const clearEatenInput = schema => {
    schema.eatenInput = '';
};

const transformFunctionCallback = schema => {
    const { eatenInput, rawInput, input } = schema;

    if (!actionManager.hasAction('repeat')) return false;

    const action = actionManager.getAction();

    const repeatCount = action.arguments[0] || 1;

    //resets
    actions.resetId();
    schema.eatenInput = '';

    //transforms
    for(let ii = 0; ii < repeatCount; ii++){
        schema.input = input;
        schema.nonEmptyValue(schema => {
            schema.eatenInput += (ii < repeatCount-1)?',':'';
        });

        actions.incrementId();
    }

    return true;
};

const generationFunctionCallback = schema => {
    const action = actionManager.getAction();

    const result = actions.call(action.name, ...action.arguments);

    if(result === false) return false;

    schema.eatenInput = result;

    return true;
};

const executeExpression = (schema) => {
    if (actionManager.hasAction('repeat')) return transformFunctionCallback(schema);

    return generationFunctionCallback(schema);
};

const registerAction = ({eatenInput}) => {
    actionManager.setAction(eatenInput);
};

const registerArgument = ({eatenInput}) => {
    actionManager.addArguments(eatenInput);
};

const templateJSONMap = {
    main: (schema) => schema.array() || schema.object(),
    nonEmptyValue: (schema) => schema.array() || schema.object() || schema.literal(),
    value: (schema) => schema.expression(executeExpression) || schema.nonEmptyValue() || schema.empty(),
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
    doubleQuote: () => '"',
    singleQuote: () => '\'',
    quote: (schema) => schema.singleQuote() || schema.doubleQuote(),
    curlyLeft: () => '\\{',
    curlyRight: () => '\\}',
    bracketLeft: () => '\\[',
    bracketRight: () => '\\]',
    paramLeft: () => '\\(',
    paramRight: () => '\\)',
    comma: () => '\\,',
    colon: () => '\\:',
    empty: () => true,

    //---------
    expression: (schema) => schema.doubleCurlyLeft() && schema.function() && schema.doubleCurlyRight(),
    doubleCurlyLeft: (schema) => schema.curlyLeft() && schema.curlyLeft(),
    doubleCurlyRight: (schema) => schema.curlyRight() && schema.curlyRight(),
    function: (schema) => schema.functionName(registerAction) && schema.paramLeft() && (schema.parameterCollection() || schema.empty()) && schema.paramRight(),
    functionName: () => '([a-z][a-z0-9_]*)',
    parameterCollection: (schema) => schema.parameter(registerArgument) && ( ( schema.comma() && schema.parameterCollection() ) || schema.empty ),
    parameter: (schema) => schema.integer() || schema.quotedString(),
    quotedString: (schema) => schema.quote(clearEatenInput) && schema.jsString() && schema.quote(clearEatenInput),
    jsString: (schema) => '\\w*',
};

export default templateJSONMap;
