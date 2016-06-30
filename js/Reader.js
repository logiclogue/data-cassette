'use strict'

let spawn = require('child_process').spawn;


/*
 * Reads tape, converts back to data.
 */
class Reader {
    constructor() {
        this.input = process.stdin;
        this.bits = [];
        this.last = 0;
        this.stream = [];

        this.input.on('data', this._readAudio.bind(this));
    }


    _readAudio(data) {
        this.stream.push(...data);
        
        let firstIndex = this.stream.length - data.length;

        data.forEach((level, index) => {
            index += firstIndex;

            if (level <= 127 && this.stream[index + 1] >= 127) {
                let bit = this.decodeBit(index - this.last);
                console.log(this.stream[index]);

                this.bits.push(bit);

                this.last = index;
            }
        });
    }

    decodeBit(waveLength, index) {
        if (index >= 10) {

        }
    }
}

module.exports = Reader;
