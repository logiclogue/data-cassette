#!/usr/bin/env node

'use strict'

let program = require('commander');
let packageJSON = require('./package.json');
let Writer = require('./js/Writer');
let WriterBitsteam = require('./js/WriterBitstream');
let Reader = require('./js/Reader');
let fs = require('fs');

program
    .version(packageJSON.version)
    .usage('[options] <file ...>')
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

    fs.readFile(program.args[0], function (err, data) {
        writer.writeData(data);
    });
}

if (program.read) {
    let reader = new Reader();
}
