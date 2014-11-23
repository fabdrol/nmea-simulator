var SerialPort  = require("serialport").SerialPort
  , port        = new SerialPort('/dev/ttyqe', { baudrate: 4800 })
;

port.on('data', function(data) {
  console.log(data.toString());
});

port.on('error', function(err) {
  console.log('ERROR;', err);
});

port.on('end', function() {
  console.log('END');
});