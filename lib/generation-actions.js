'use babel';

import moment from 'moment';
import { string, words } from './mock-data.js';

export default class GenerationActions{
    constructor() {
        this._id = 1;
        this._guid = 1;
    }

    _resetId() {
        this._id = 1;
    }

    call(action, ...args) {
        if (!this[action]) return false;

        return this[action](...args);
    }

    boolean() {
        return (Math.random() > 0.5)+'';
    }

    email() {
        let email_words = [];
        while (email_words.length < 4){
            const word = words[Math.floor(Math.random() * words.length)];

            if(word.length >= 4) email_words.push(word);
        }

        const domain = email_words.pop();
        let email = email_words.reduce((a, w) => `${a}.${w}`);

        email = `${email}@${domain}.com`;

        return email;
    }

    guid() {
        return this._guid++;
    }

    random(min = 0, max = 100) {
        min = Math.max(0, min);
        max = Math.max(min, max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    datetime() {
        const max = moment().format('x');
        const min = max - 604800000;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    string(length = 25) {
        return `"${string.substr(0, length)}"`;
    }

    id() {
        return this._id++;
    }
}
