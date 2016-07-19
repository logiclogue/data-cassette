'use strict';

var Reader = require('./Reader');


/*
 * Extends Reader. Uses process.stdin instead of
 * aplay.stdout.
 */
class ReaderBitstream extends Reader {
    constructor() {
        super();

        this.input = process.stdin;
    }
}

module.exports = ReaderBitstream;
