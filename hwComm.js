const { hwPath, idDev } = require('./options');
const exec = require('child_process').exec;
const sender = require('./sender');
const log = require('./log');

let noSleep = false;
let noShot = false;

module.exports.sensRead = (callback) => {
  exec(`python3 ${hwPath}/ardsens.py`, (error, stdout, stderr) => {
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
        sender({ "type": "info", "event": "warn", "message": "sensRead fail 1", "date": (new Date).toISOString() });
      }
      if (sensors.error2) {
        sensErr.error2 = sensors.error2;
        delete sensors.error2;
        sender({ "type": "info", "event": "warn", "message": "sensRead fail 2", "date": (new Date).toISOString() });
      }
    }
    if (sensors.volt || sensors.mic || sensors.press) {
      sensors.date = (new Date).toISOString();
    }
    callback(sensErr, sensors);
  });
}

const sigSleep = (time, callback) => {
  if (time > 0) {
    exec(`python3 ${hwPath}/ardsleep.py ${time}`, (error, stdout, stderr) => {
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

const shutdown = (sleepMin) => {
  const sleepTime = Math.round(sleepMin);
  if (sleepTime > 0) {
    noShot = true;
    if (noSleep) {
      setTimeout(()=> {
        shutdown(sleepMin);
      }, 5000);
    } else {
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
            sender({ "type": "info", "event": "warn", "message": "ardsleep fail", "date": (new Date).toISOString() });
            setTimeout(()=> {
              shutdown(sleepMin);
            }, 5000);
          }
        }
      });
    }
  } else {
    log('sleepTime is ' + sleepTime);
  }
}

module.exports.shutdown = shutdown;

module.exports.shotAndSendPhoto = (callback) => {
  if (!noShot && !noSleep) {
    noSleep = true;
    exec(`raspistill -w 320 -h 240 -q 50 -o /tmpvid/cam/${idDev}.jpg && scp /tmpvid/cam/${idDev}.jpg pi@geoworks.pro:/home/pi/camphotos/${idDev}.jpg.tmp && ssh pi@geoworks.pro 'rm /home/pi/camphotos/${idDev}.jpg;mv /home/pi/camphotos/${idDev}.jpg.tmp /home/pi/camphotos/${idDev}.jpg';rm /tmpvid/cam/${idDev}.jpg`, () => {
      noSleep = false;
      callback();
    });
  } else {
    callback(true);
  }
}

module.exports.startStream = () => {
  if (!noShot && !noSleep) {
    noSleep = true;
    exec(`uv4l -nopreview --auto-video_nr --driver raspicam --encoding mjpeg --width 640 --height 480 --framerate 5`);
  }
}

module.exports.stopStream = () => {
  if (noSleep) {
    exec(`sudo pkill uv4l`, () => {
      noSleep = false;
    });
  }
}
