'use strict'

let program = require('commander');
let packageJSON = require('./package.json');
let Writer = require('./js/Writer');
let Reader = require('./js/Reader');

program
    .version(packageJSON.version)
    .option('-w, --write', 'Writes to tape')
    .option('-r, --read', 'Reads from tape')
    .parse(process.argv);

if (program.write) {
    let writer = new Writer();
    
    let string = 'This is a test which will be converted into audio.';
    let outputArray = string.split('');

    outputArray = outputArray.map((letter) => {
        return letter.charCodeAt(0);
    });

    writer.writeData(outputArray);
}

if (program.read) {
    let reader = new Reader();
}
