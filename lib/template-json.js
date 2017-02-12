'use babel';

import { CompositeDisposable } from 'atom';
import path from 'path';
import fs from 'fs';
import Schema from 'extensible-compiler';
import prettydiff from '../bin/prettydiff';
import pathUtils from '../utils/path';
import jsonMap from './json-map';
import TaskManager from './task-manager.js';

export default {
    subscriptions : null,

    activate(state) {
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions
            .add(atom.commands.add('atom-workspace', {
                'template-json:generate': () => this.generate()
            }));

        this.subscriptions
            .add(atom.commands.add('atom-workspace', {
                'template-json:generate-all': () => this.generateAll()
            }));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    serialize() {},

    generate() {

    },

    generateAll() {
        const taskManager = new TaskManager(
            '*.template.json',
            file => {
                return this.generateJSONFile(file);
            },
            (result, err) => {
                if (err) {
                    atom.notifications.addError('Some JSON files could not be generated');
                } else {
                    atom.notifications.addSuccess('JSON files generated successfully');
                }
            }
        );
    },

    /*generate() {
        if(pathUtils.isFileExtension(editor.getPath(), '.template.json')){
            // this.generateJSONFile(editor.getPath());
        }else{
            atom.notifications.addWarning('You must create a *.template.json file in order to run this command.', {
                dismissable: true
            });
        }
    }*/

    generateJSONFile(file = '') {
        return new Promise((resolve, reject) => {
            const pathName = file.getPath();

            if (!pathUtils.isFileExtension(pathName, '.template.json')) resolve(false);

            const errorFn = (err) => {
                const notification = atom.notifications.addError('Could not complete generation.', {
                    detail: err.syscall,
                    dismissable: true,
                });
            };

            const input = file.read(false).then(input => {
                const schema = new Schema(jsonMap, input, 'nonEmptyValue');
                const result = schema.parse();
                const result_str = prettydiff({
                    source: schema.eatenInput,
                    mode: 'beautify',
                    lang: 'json'
                });

                if (!result) {
                    atom.notifications.addError('Could not generate JSON', {
                        detail: 'Check your template JSON for any syntax errors.',
                        dismissable: true,
                    });
                }

                const outputFile = path.join(path.dirname(pathName), path.basename(pathName, '.template.json')+'.json');
                fs.open(outputFile, 'w', (err, fd) => {
                    if (err) {
                        errorFn(err);

                        return resolve(false);
                    }

                    fs.writeFile(fd, result_str, (err) => {
                        if (err) {
                            errorFn(err);

                            return resolve(false);
                        }

                        resolve(true);
                    });
                });
            });
        });
    },










    /*generate() {
        let selection = '';
        let editor = atom.workspace.getActiveTextEditor();

        if(!editor) return false;

        if(pathUtils.getFileExtension(editor.getPath()) == '.template.json'){
            selection = editor.getText();
        }else{
            atom.notifications.addWarning('You must generate a *.template.json file in order to run this command.', {
                dismissable: true
            });
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
                dismissable: true,
            });
        };

        if (!result) return atom.notifications.addError('Could not generate JSON', {
            detail: 'Check your template JSON for any syntax errors.',
            dismissable: true,
        });

        const outputFile = path.join(path.dirname(editor.getPath()), path.basename(editor.getPath(), '.template.json')+'.json');
        fs.open(outputFile, 'w', (err, fd) => {
            if (err) return errorFn(err);

            fs.writeFile(fd, result_str, (err) => {
                if (err) return errorFn(err);

                const notification = atom.notifications.addSuccess('Atom JSON Generate: JSON generation complete.', {
                    detail: `[Updated] ${outputFile}`,
                    dismissable: true,
                });

                setTimeout(() => {
                    notification.dismiss();
                }, 5000);
            });
        });
    }*/

};
