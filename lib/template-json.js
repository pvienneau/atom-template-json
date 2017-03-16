'use babel';

import { CompositeDisposable, TextEditor, File } from 'atom';
import path from 'path';
import fs from 'fs';
import Schema from 'extensible-compiler';
import prettydiff from '../bin/prettydiff';
import pathUtils from '../utils/path';
import jsonMap from './json-map';

export default {
    subscriptions : null,

    config: {
        saveToDisk: {
            title: 'Save export to disk',
            description: 'If true, exported JSON will be saved to file in the same directory as the template JSON file. If false, it will export to a tab without saving to disk.',
            type: 'boolean',
            default: true,
        }
    },

    activate(state) {
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'template-json:generate': () => this.generate()
        }));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    serialize() {},

    generate() {
        let selection = '';
        let editor = atom.workspace.getActiveTextEditor();

        if(!editor) return false;

        if(pathUtils.getFileExtension(editor.getPath()) == '.template.json'){
            selection = editor.getText();
        }else{
            atom.notifications.addWarning('You must generate a *.template.json file in order to run this command.');
        }

        if(!selection.length) return false;

        var schema = new Schema(jsonMap, selection, 'nonEmptyValue');

        var result = schema.parse();
        var result_str = prettydiff({
            source: schema.eatenInput,
            mode: 'beautify',
            lang: 'json'
        });

        const errorFn = (err) => {
            const notification = atom.notifications.addError('Could not complete JSON generation.', {
                detail: err.syscall,
            });
        };

        if (!result) return atom.notifications.addError('Could not generate JSON', {
            detail: 'Check your template JSON for any syntax errors.',
        });

        const outputFilePath = path.join(path.dirname(editor.getPath()), path.basename(editor.getPath(), '.template.json')+'.json');
        const saveToDisk = atom.config.get('template-json.saveToDisk');
        let existsPrior = false;

        if (saveToDisk) {
            const file = new File(outputFilePath);

            existsPrior = file.existsSync();

            file.writeSync(result_str);
        } else {
            atom.workspace.open(outputFilePath).then(textEditor => {
                textEditor.setText(result_str);
            });
        }

        const notification = atom.notifications.addSuccess(
            'Template JSON: JSON generation complete.',
            saveToDisk ?
            {
                detail: `[${!existsPrior?'Created':'Updated'}] ${outputFilePath}`,
            } : {}
        );

        setTimeout(() => {
            notification.dismiss();
        }, 5000);
    }

};
