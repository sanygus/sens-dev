const { hwPath } = require('./options');
const exec = require('child_process').exec;

module.exports.sensRead = (callback) => {
  exec(`python ${hwPath}/ardsens.py`, (error, stdout, stderr) => {
    if (error) {
      return callback(error);
    }
    if (stderr) {
      return callback(new Error(stderr));
    }
    const sensors = JSON.parse(stdout);
    let sensErr = null;
    if (sensors.error1 || sensors.error2) {
      sensErr = {};
      if (sensors.error1) {
        sensErr.error1 = sensors.error1;
        delete sensors.error1;
      }
      if (sensors.error2) {
        sensErr.error2 = sensors.error2;
        delete sensors.error2;
      }
    }
    callback(sensErr, sensors);
  });
}

module.exports.sigSleep = (time, callback) => {
  if (time > 0) {
    exec(`python ${hwPath}/ardsleep.py ${time}`, (error, stdout, stderr) => {
      if (error) {
        return callback(error);
      }
      if (stderr) {
        return callback(new Error(stderr));
      }
      callback(null, JSON.parse(stdout).success);
    });
  } else {
    callback(new Error('time sleep must be > 0'))
  }
}
