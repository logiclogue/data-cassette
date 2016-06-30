'use strict'

/*
 * Writes data to the tape.
 */
class Writer {
    constructor() {
        let spawn = require('child_process').spawn;
        
        this.sampleRate = 44100;

        this.aplay = spawn('aplay', ['-r', this.sampleRate]);
        this.program = this.aplay.stdin;

        this.output = [];
        this.cycle = 1 / this.sampleRate;
        this.bitFrequencies = [600, 900];
        this.startBit = this.bitFrequencies[0];
        this.stopBit = this.bitFrequencies[1];
    }


    /*
     * Accepts a byte array and converts it into
     * sound.
     */
    writeData(byteArray) {
        // Lead in tone.
        for (let i = 0; i < 4; i += 1) {
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

        for (let i = 7; i >= 0; i -= 1) {
            if (data & 1 << i) {
                this.writeWave(this.bitFrequencies[1]);
                console.log(1);
            }
            else {
                this.writeWave(this.bitFrequencies[0]);
                console.log(0);
            }
        }
    }

    /*
     * Outputs a sine wave of specified frequency.
     */
    writeWave(frequency) {
        let timePeriod = 1 / frequency;

        for (let i = 0; i < timePeriod; i += this.cycle) {
            let output = Math.sin(i * 2 * Math.PI * frequency);

            output *= 128;
            output += 128;
            output = Math.floor(output);

            this.output.push(output);
        }
    }
}

module.exports = Writer;
