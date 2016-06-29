var Write = require('./js/Write');
var write = new Write();

var string = 'This is a test which will be converted into audio.';
var outputArray = string.split('');

outputArray = outputArray.map((letter) => {
    return letter.charCodeAt(0);
});

write.writeData(outputArray);
