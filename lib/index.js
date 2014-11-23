(function(module, undef) {
  var LineReader  = require('line-by-line')
    , path        = require('path')
    , SerialPort  = require("serialport").SerialPort
    , stream      = undef
    , port        = undef
  ;

  module.exports = function(filename, serialport) {
    var lf      = filename || './logs/plaka.log';
    var sport   = serialport || '/dev/ptyqe';

    init(lf, sport);
  };

  function init(logFile, portName) {
    stream  = new LineReader(path.join(process.cwd(), '../', logFile));
    port    = new SerialPort(portName, { baudrate: 4800 });

    stream.on('line', function(sentence) {
      if(validSentence(sentence) && typeof port === 'object' && port !== null && typeof port.write === 'function') {
        port.write(sentence + "\r\n", function(err, results) {});
      }
    });

    stream.on('error', function(err) {
      throw err;
    });

    stream.on('end', function() {
      try {
        stream.end();
        stream.close();
        stream.destroy();
      } catch(err) {}

      try {
        port.close();
      } catch(err) {}

      port = undef;
      stream = undef;

      setTimeout(function() {
        init(logFile, portName);
      }, 500);
    });
  }

  function validSentence(sentence) {
    sentence = String(sentence).trim();

    if(sentence === "") {
      return false;
    }

    if((sentence.charAt(0) == '$' || sentence.charAt(0) == '!') && sentence.charAt(sentence.length - 3) == '*') {
      var check = 0;
      var split = sentence.split('*');

      for (var i = 1; i < split[0].length; i++) {
        check = check ^ split[0].charCodeAt(i);
      };

      return (parseInt(split[1], 16) == check);
    } else {
      return false;
    }
  }

})(module);