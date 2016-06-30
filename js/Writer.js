'use strict'

/*
 * Writes data to the tape.
 */
class Writer {
    constructor() {
        var spawn = require('child_process').spawn;
        
        this.sampleRate = 44100;

        this.aplay = spawn('aplay', ['-r', this.sampleRate]);
        this.program = this.aplay.stdin;

        this.output = [];
        this.cycle = 1 / this.sampleRate;
        this.bitFrequencies = [600, 900];
        this.startBit = this.bitFrequencies[1];
        this.stopBit = this.bitFrequencies[0];
    }


    /*
     * Accepts a byte array and converts it into
     * sound.
     */
    writeData(byteArray) {
        // Lead in tone.
        for (var i = 0; i < 500; i += 1) {
            this.writeWave(this.bitFrequencies[0]);
        }

        // Writes each byte.
        byteArray.forEach((data) => {
            this.writeByte(data);
        });

        // Writes stop bit.
        this.writeWave(this.stopBit);

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

        for (var i = 0; i < 7; i += 1) {
            if (data & 1 << i) {
                this.writeWave(this.bitFrequencies[0]);
            }
            else {
                this.writeWave(this.bitFrequencies[1]);
            }
        }
    }

    /*
     * Outputs a sine wave of specified frequency.
     */
    writeWave(frequency) {
        var timePeriod = 1 / frequency;

        for (var i = 0; i < timePeriod; i += this.cycle) {
            var output = Math.sin(i * 2 * Math.PI * frequency);

            output *= 128;
            output = Math.floor(output);

            this.output.push(output);
        }
    }
}

module.exports = Writer;
