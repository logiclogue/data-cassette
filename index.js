'use strict'

let program = require('commander');
let packageJSON = require('./package.json');
let Writer = require('./js/Writer');
let WriterBitsteam = require('./js/WriterBitstream');
let Reader = require('./js/Reader');

program
    .version(packageJSON.version)
    .option('-w, --write', 'Writes to tape')
    .option('-r, --read', 'Reads from tape')
    .option('-b, --bitsteam', 'Reads/writes to/from bitsteam')
    .parse(process.argv);

if (program.write) {
    let writer;

    if (program.bitsteam) {
        writer = new WriterBitsteam();
    }
    else {
        writer = new Writer();
    }
    
    let string = 'This is a test which will be converted into audio.';
    string = 'Fig 1 shows the signal coming into A0.  The start and end of one cycle measured by timer is indicated by the image note.  Fig 2 shows the output from the serial monitor (command/ctrl+shift+m).  This technique works great for sine waves, but when wave become more complicated (and cross 2.5V more than twice in one cycle) this technique breaks down.';
    let outputArray = string.split('');

    outputArray = outputArray.map((letter) => {
        return letter.charCodeAt(0);
    });

    writer.writeData(outputArray);
}

if (program.read) {
    let reader = new Reader();
}
