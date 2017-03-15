'use babel';

import { CompositeDisposable, TextEditor } from 'atom';
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
            const notification = atom.notifications.addError('Could not complete generate.', {
                detail: err.syscall,
            });
        };

        if (!result) return atom.notifications.addError('Could not generate JSON', {
            detail: 'Check your template JSON for any syntax errors.',
        });

        const outputFile = path.join(path.dirname(editor.getPath()), path.basename(editor.getPath(), '.template.json')+'.json');
        /*fs.open(outputFile, 'w', (err, fd) => {
            if (err) return errorFn(err);

            fs.writeFile(fd, result_str, (err) => {
                if (err) return errorFn(err);

                const notification = atom.notifications.addSuccess('Atom JSON Generate: JSON generation complete.', {
                    detail: `[Updated] ${outputFile}`,
                });

                setTimeout(() => {
                    notification.dismiss();
                }, 5000);
            });
        });*/

        const textEditor = new TextEditor();

        textEditor.nativeGetTitle = textEditor.getTitle;
        textEditor.getTitle = function() {
            var title;
            return (title = this.nativeGetTitle()) != 'untitled' ? title : path.basename(outputFile);
        };

        textEditor.setText(result_str);

        atom.workspace.getActivePane().addItem(textEditor);
        atom.workspace.getActivePane().activateNextItem();

        if (atom.config.get('template-json.saveToDisk')) textEditor.saveAs(outputFile);
    }

};
