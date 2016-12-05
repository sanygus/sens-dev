const { hwPath } = require('./options');
const exec = require('child_process').exec;
const log = require('./log');

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
    sensors.date = (new Date).toISOString();
    callback(sensErr, sensors);
  });
}

const sigSleep = (time, callback) => {
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

module.exports.shutdown = (timems) => {
  const sleepTime = Math.round(timems / (60 * 1000)); // ms to mins
  if (sleepTime > 0) {
    //log to server about sleep time
    sigSleep(sleepTime, (err, success) => {
      if (err) { log(err); } else {
        if (success) {
          exec('sudo shutdown -h now', (error, stdout, stderr) => {
            if (error || stderr) {
              log('error in shutdown, but ardsleep success'); // !WARN
              log(error || stderr);
            }
          });
        } else {
          log('ardsleep fail'); // !WARN
        }
      }
    });
  } else {
    log('sleepTime is ' + sleepTime + ', timems: ' + timems);
  }
}
