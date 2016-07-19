'use strict';

var Writer = require('./Writer');


/*
 * Extends Writer. Uses processes.stdout instead
 * of aplay.stdin.
 */
class WriterBitsteam extends Writer {
    constructor() {
        super();

        this.program = process.stdout;
    }


    /*
     * Overrides outputAudio method. process.stdout
     * doesn't have a .end() method.
     */
    outputAudio() {
        this.program.write(new Buffer(this.output));
        process.exit(1);
    }
}

module.exports = WriterBitsteam;
