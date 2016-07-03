'use strict'

let spawn = require('child_process').spawn;
let config = require('../config.json');


/*
 * Reads tape, converts back to data.
 */
class Reader {
    constructor() {
        this.input = process.stdin;
        this.bits = [];
        this.last = 0;
        this.stream = [];
        this.leadCount = 0;
        this.reading = false;
        this.currentByte = [];
        this.wavelengths = config.frequencies.map((num) => {
            return config.sampleRate / num;
        });

        this.input.on('data', this._readAudio.bind(this));
    }


    /*
     * Method that receives audio...
     */
    _readAudio(data) {
        this.stream.push.apply(this.stream, data);
        
        let firstIndex = this.stream.length - data.length;

        data.forEach((level, index) => {
            index += firstIndex;

            if (this.stream[index - 1] < 127 && level >= 127) {
                let bit = this.decodeBit(index - this.last);

                if (bit === 0 || bit === 1) {
                    this.detect(bit);
                }

                this.bits.push(bit);

                this.last = index;
            }
        });
    }

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

    decodeByte(bit) {
        if (this.currentByte.length === 8) {
            return true;
        }

        if (bit === 0 || bit === 1) {
            this.currentByte.push(bit);
        }
    }

    decodeBit(wavelength) {
        if (Math.abs(this.wavelengths[1] - wavelength) < Math.abs(this.wavelengths[0] - wavelength)) {
            return 1;
        }
        else if (Math.abs(this.wavelengths[0] - wavelength) < Math.abs(this.wavelengths[1] - wavelength)) {
            return 0;
        }
    }

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

    convertByteArrayToNumber(byteArray) {
        let number = 0;

        byteArray.forEach((bit, index) => {
            if (bit === 1) {
                number += Math.pow(2, 7 - index);
            }
        });

        return number;
    }
}

module.exports = Reader;
