'use strict'

let spawn = require('child_process').spawn;


/*
 * Reads tape, converts back to data.
 */
class Reader {
    constructor() {
        this.input = process.stdin;

        this.input.on('data', (data) => {
            console.log(data);
        });
    }
}

module.exports = Reader;
