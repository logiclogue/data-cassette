'use strict'

let config = require('../config.json');
let BaseConverter = require('./BaseConverter');

/*
 * Writes data to the tape.
 */
class Writer {
    constructor() {
        let spawn = require('child_process').spawn;
        
        this.sampleRate = config.sampleRate;

        this.aplay = spawn('aplay', ['-r', this.sampleRate]);
        this.program = this.aplay.stdin;

        this.output = [];
        this.cycle = 1 / this.sampleRate;
        this.bitFrequencies = config.frequencies;
        this.startBit = this.bitFrequencies[0];
        this.stopBit = this.bitFrequencies[1];

        this.conv = new BaseConverter(this.bitFrequencies.length);
    }


    /*
     * Accepts a byte array and converts it into
     * sound.
     */
    writeData(byteArray) {
        // Lead in tone.
        for (let i = 0; i < 500; i += 1) {
            this.writeWave(this.stopBit);
        }

        // Writes each byte.
        byteArray.forEach((data) => {
            this.writeByte(data);
        });

        // Writes stop bit.
        for (let i = 0; i < 4; i += 1) {
            this.writeWave(this.stopBit);
        }

        // Output
        this.outputAudio();
    }

    /*
     * Outputs audio to selected output.
     */
    outputAudio() {
        this.program.write(new Buffer(this.output));
        this.program.end();
    }

    /*
     * Converts a single byte into sound waves.
     */
    writeByte(data) {
        this.writeWave(this.startBit);

        let bitArray = this.conv.convert(data);

        bitArray.forEach((bit) => {
            this.writeWave(this.bitFrequencies[bit]);
        });
    }

    /*
     * Outputs a sine wave of specified frequency.
     */
    writeWave(frequency) {
        let timePeriod = 1 / frequency;

        for (let i = 0; i < timePeriod; i += this.cycle) {
            let output = Math.sin(i * 2 * Math.PI * frequency);

            output = output >= 0 ? Math.ceil(output) : Math.floor(output);
            output *= 128;
            output += 128;
            output = Math.floor(output);

            this.output.push(output);
        }
    }
}

module.exports = Writer;
