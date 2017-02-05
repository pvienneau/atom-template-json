module.exports = {
    nonEmptyValue: (schema) => schema.complexValue() || schema.literal(),
    complexValue: (schema) => schema.liquidTransform() || schema.array() || schema.object(),
    value: (schema) => schema.liquidGenerate() || schema.nonEmptyValue() || schema.empty(),
    object: (schema) => schema.curlyLeft() && schema.objectValue() && schema.curlyRight(),
    objectValue: (schema) => (schema.strictString() && schema.colon() && schema.value() && ((schema.comma() && schema.objectValue())|| schema.empty())) || schema.empty(),
    array: (schema) => schema.bracketLeft() && schema.arrayValue() && schema.bracketRight(),
    arrayValue: (schema) => schema.value() && ((schema.comma() && schema.arrayValue()) || schema.empty()),
    literal: (schema) => {return (schema.integer() || schema.string() || schema.boolean() || schema.null())},
    integer: (schema) => '-?[0-9]+(\\.[0-9]*)?(e[0-9]+)?',
    strictString: (schema) => '"(\\\\"|[^"])*"',
    string: (schema) => '"(\\\\(?:[bfnrt\\\\\/"]|u[0-9a-f])|[^"\\\\])*"',
    boolean: (schema) => 'true|false',
    null: () => 'null',
    curlyLeft: () => '{',
    curlyRight: () => '}',
    bracketLeft: () => '\\[',
    bracketRight: () => ']',
    comma: () => ',',
    colon: () => ':',
    empty: () => true,

    parensLeft: () => '\\(',
    parensRight: () => '\\)',

    // --------------------
    liquidGenerate: schema => schema.lCommand(),
    liquidTransform: schema => schema.curlyLeft(clearEatenInput) && schema.curlyLeft(clearEatenInput) && schema.lFunctionName(repeat) && schema.curlyRight(clearEatenInput) && schema.curlyRight(clearEatenInput),
    lCommand: schema => schema.curlyLeft(clearEatenInput) && schema.curlyLeft(clearEatenInput) && schema.lFunction() && schema.curlyRight(clearEatenInput) && schema.curlyRight(clearEatenInput),
    lFunction: schema => schema.lFunctionName((schema, action, ...args) => {
        args = args.map(arg => parseInt(arg));

        schema.eatenInput = () => {
            const string_value = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque dolor lorem. Mauris vulputate dolor id libero elementum fermentum. Sed ac metus ut nisl aliquam rhoncus. Sed et mattis leo. Phasellus pharetra volutpat tempus. Vestibulum pretium lacus vitae fermentum gravida. Sed ut viverra turpis. Vestibulum semper efficitur augue, sed consectetur odio volutpat ut. In eget sollicitudin odio. Quisque cursus nisl id nisl eleifend varius. Proin et vestibulum eros, consequat sagittis nibh. Phasellus id porttitor mauris. Integer nulla arcu, interdum eget sagittis posuere, aliquam vel augue. Mauris luctus elementum est, finibus semper nunc. Nunc lorem mauris, tincidunt nec tellus quis, condimentum.";

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

            return schema.eatenInput;
        }();
    }),
    lFunctionName: () => '([a-z][a-z0-9_]*)\\(([0-9]*)(?:,([0-9]*))*\\)',
};
