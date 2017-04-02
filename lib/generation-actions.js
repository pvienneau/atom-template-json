'use babel';

import moment from 'moment';
import { string, words, firstNames, lastNames } from './mock-data.js';

export default class GenerationActions{
    constructor() {
        this._guid = 1;
        this._id;
        this._indexes;

        this._resetIndexes();
    }

    resetId() {
        this._resetIndexes();
    }

    incrementId() {
        this._id++;
    }

    _resetIndexes() {
        this._id = 1;

        this._indexes = {};
    }

    _getIndex(key) {
        try{
            return this._indexes[this._id][key];
        }catch(e) {
            return false;
        }
    }

    _setIndex(key, value) {
        if (!this._indexes[this._id]) this._indexes[this._id] = {};

        this._indexes[this._id][key] = value;

        return true;
    }

    call(action, ...args) {
        if (!this[action] || action == 'call') return false;

        return this[action](...args);
    }

    boolean() {
        return (Math.random() > 0.5)+'';
    }

    email() {
        return `"${this._firstName().toLowerCase()}.${this._lastName().toLowerCase()}@domain.com"`;
    }

    guid() {
        return this._guid++;
    }

    random(min = 0, max = 100) {
        min = Math.max(0, min);
        max = Math.max(min, max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    timestamp() {
        const max = moment().format('x');
        const min = max - 604800000;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    string(length = 25) {
        return `"${string.substr(0, length)}"`;
    }

    id() {
        return this._id;
    }

    fullName() {
        return `"${this._firstName()} ${this._lastName()}"`;
    }

    firstName() {
        return `"${this._firstName()}"`;
    }

    _firstName() {
        if (!(index = this._getIndex('firstName'))) {
            index = this.random(0, firstNames.length);
            this._setIndex('firstName', index);
        }

        return firstNames[index];
    }

    lastName() {
        return  `"${this._lastName()}"`;
    }

    _lastName() {
        if (!(index = this._getIndex('lastName'))) {
            index = this.random(0, firstNames.length);
            this._setIndex('lastName', index);
        }

        return  firstNames[index];
    }
}
