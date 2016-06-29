var Writer = require('./js/Writer');
var writer = new Writer();

var string = 'This is a test which will be converted into audio.';
var outputArray = string.split('');

outputArray = outputArray.map((letter) => {
    return letter.charCodeAt(0);
});

writer.writeData(outputArray);
