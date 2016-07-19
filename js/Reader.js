'use strict';

let spawn = require('child_process').spawn;
let config = require('../config.json');


/*
 * Reads tape, converts back to data.
 */
class Reader {
    constructor() {
        this.sampleRate = config.sampleRate;

        this.arecord = spawn('arecord', ['-r', this.sampleRate, '-c', 1]);
        this.input = this.arecord.stdout;

        this.last = 0;
        this.stream = [];
        this.leadCount = 0;
        this.reading = false;
        this.currentByte = [];
        this.wavelengths = config.frequencies.map((num) => {
            return config.sampleRate / num;
        });
    }

    
    /*
     * Starts reading the audio and decodes it.
     */
    start() {
        this.input.on('data', this._readAudio.bind(this));
    }


    /*
     * Method that receives audio from stdin and reads each byte.
     */
    _readAudio(data) {
        this.stream.push.apply(this.stream, data);
        
        let firstIndex = this.stream.length - data.length;

        data.forEach((level, index) => {
            index += firstIndex;

            if (this.stream[index - 1] < 127 && level >= 127) {
                let bit = this.decodeBit(index - this.last);

                this.detect(bit);

                this.last = index;
            }

            delete this.stream[index - 1];
        });
    }

    /*
     * Deals with each bit.
     */
    detect(bit) {
        let readByte = this.currentByte.length === 8;

        // Reading lead tone.
        if (!this.reading) {
            this.detectLeadTone(bit);

            return;
        }

        if (readByte) {
            process.stdout.write(new Buffer([this.convertByteArrayToNumber(this.currentByte)]));
        }

        // If read byte and stop bit.
        if (readByte && bit === 1) {
            this.reading = false;

            process.exit(0);

            return;
        }

        // If read byte and start bit.
        if (readByte && bit === 0) {
            this.currentByte = [];

            return;
        }

        this.decodeByte(bit);
    }

    /*
     * Detects whether the whole byte has been read.
     */
    decodeByte(bit) {
        if (this.currentByte.length === 8) {
            return true;
        }

        this.currentByte.push(bit);
    }

    /*
     * Finds which bit the detected wave is.
     */
    decodeBit(wavelength) {
        let current = this.wavelengths[0];
        let bit = 0;

        this.wavelengths.forEach((val, index) => {
            if (Math.abs(wavelength - val) < Math.abs(wavelength - current)) {
                current = val;
                bit = index;
            }
        });

        return bit;
    }

    /*
     * Detects whether the lead tone has been found.
     */
    detectLeadTone(bit) {
        if (this.leadCount >= 50 && bit === 0) {
            this.reading = true;

            return true;
        }

        if (bit === 1) {
            this.leadCount += 1;
        }
        else {
            this.leadCount = 0;
        }

        this.reading = false;

        return false;
    }

    /*
     * Converts the current byte array into a number.
     */
    convertByteArrayToNumber(byteArray, base) {
        base = base || 2;

        let number = 0;

        byteArray.forEach((bit, index) => {
            if (bit === 1) {
                number += Math.pow(base, 7 - index);
            }
        });

        return number;
    }
}

module.exports = Reader;
