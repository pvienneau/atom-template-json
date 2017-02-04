'use babel';

import {CompositeDisposable} from 'atom';
import path from 'path';
import Schema from 'extensible-parser';
import moment from 'moment';
import prettydiff from '../bin/prettydiff';
console.log(prettydiff);

let guid = 1;
let id = 1;

export default {
    subscriptions : null,

    activate(state) {
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'json-generator:generate': () => this.generate()
        }));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    serialize() {},

    generate() {
        guid = 1;
        id = 1;

        let selection = '';
        let isSelectionText = true;
        let editor = atom.workspace.getActiveTextEditor();

        if(!editor) return false;

        if(path.extname(editor.getPath()) == '.json'){
            //replace whole file
            selection = editor.getText();
            isSelectionText = false;
        }else{
            selection = editor.getSelectedText();
        }

        if(!selection.length) return false;

        console.log('selection: ', selection);

        const clearEatenInput = schema => {schema.eatenInput = ''};
        const repeat = (schema, action, ...args) => {
            const {eatenInput, rawInput, input} = schema;

            id = 1;
            schema.eatenInput = '';

            for(let ii = 0; ii < args[0]; ii++){
                schema.input = input;
                schema.saveNodeImage(schema.complexValue(schema => {if(ii < (args[0]-1)) schema.eatenInput += ','}));
            }
        }
        var schema = new Schema({
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
        }, selection);

        var result = schema.parse('nonEmptyValue');

        console.log('result: ', result);
        console.log(schema);
        //const generatedJSON = this.generator.generateJSON(selection);

        /*if(isSelectionText){
            editor.insertText(generatedJSON, {
                select: true,
                autoIndent: true,
            });
        }else{
            editor.setText(generatedJSON);
        }*/

        /*if (selection.length) {
            //replace selected text
            let reversed = selection.split('').reverse().join('')
            editor.insertText('!!!!!!');
        }else if(path.extname(editor.getPath()) == '.json'){
            //replace whole file
            selection = editor.getText();
        }*/

        if(result && selection.length){
            editor.setText(prettydiff({
                source: schema.eatenInput,
                mode: 'beautify',
                lang  : 'json',
            }));

            atom.commands.dispatch(atom.views.getView(atom.workspace), "atom-beautify:beautify-editor");
        }
    }

};
