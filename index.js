#!/usr/bin/env node

'use strict'

let program = require('commander');
let packageJSON = require('./package.json');
let Writer = require('./js/Writer');
let WriterBitsteam = require('./js/WriterBitstream');
let Reader = require('./js/Reader');
let ReaderBitstream = require('./js/ReaderBitstream');
let fs = require('fs');

program
    .version(packageJSON.version)
    .usage('[options] <file ...>')
    .option('-w, --write', 'Writes to tape')
    .option('-r, --read', 'Reads from tape')
    .option('-b, --bitstream', 'Reads/writes to/from bitsteam')
    .parse(process.argv);

if (program.write) {
    let writer;

    if (program.bitstream) {
        writer = new WriterBitsteam();
    }
    else {
        writer = new Writer();
    }

    fs.readFile(program.args[0], function (err, data) {
        writer.writeData(data);
    });
}
else if (program.read) {
    let reader;

    if (program.bitstream) {
        reader = new ReaderBitstream();
    }
    else {
        reader = new Reader();
    }

    reader.start();
}

if (!program.read && !program.write)
    program.help();
