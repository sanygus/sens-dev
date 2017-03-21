const { powerManagerFile: fileName, power: powerOptions } = require('./options');
const hwComm = require('./hwComm');
const sender = require('./sender');
const log = require('./log');
const fs = require('fs');
let powerParams = {};
let currentVolt = null;
let startVolt = null;
let startMeasure = true;

const init = () => {
  fs.readFile(fileName, (err, data) => {
    if (err) {
      throw err;
    } else {
      powerParams = JSON.parse(data);
    }
  })
}

const voltToCharge = (volt) => {
  let charge = 0;
  if (volt === undefined) {
    charge = 1;
    log('no statistics about volts');
  } else if ((volt === 0)||(volt < 20)) {
    charge = 1;
    log('volt no connected!'); // WARN
    sender({ "type": "info", "event": "warn", "message": "volt no connected!", "volt": volt, "date": (new Date).toISOString() });
  } else if (volt > powerOptions.maxCharge) {
    charge = 1;
    log('outside charge interval >');
  } else if (volt < powerOptions.minCharge) {
    charge = 0;
    log('outside charge interval <');
  } else {
    charge = (volt - powerOptions.minCharge) / (powerOptions.maxCharge - powerOptions.minCharge);
  }
  return charge;
}

const final = () => {
  if (startVolt > currentVolt) {//доработать
    powerParams.costQuant = voltToCharge(startVolt) - voltToCharge(currentVolt);
  } else {
    powerParams.costQuant = 0.0015;
  }
  fs.writeFile(fileName, JSON.stringify(powerParams), log);
  //testing
  let currentSleepTime = 1;
  const rnd = Math.random();
  if (rnd > 0.9) { currentSleepTime = 5 * 60; } else
  if (rnd > 0.8) { currentSleepTime = 2 * 60; } else
  if (rnd > 0.7) { currentSleepTime = 60; } else
  if (rnd > 0.01) { currentSleepTime = rnd * 100; }
  /*const lifeAllTime = (new Date(powerParams.lifeToTime) - new Date()) / 60000;
  if(lifeAllTime > 0) {
    currentSleepTime = Math.round((lifeAllTime * powerParams.costQuant) / voltToCharge(currentVolt));
    if (currentSleepTime > 1) {
      let wakeUpTime = new Date(new Date().valueOf() + currentSleepTime * 60000);
      const initTimeSleep = new Date(wakeUpTime.valueOf());
      if (wakeUpTime.getHours() < powerOptions.workHoursStart) {
        wakeUpTime.setHours(powerOptions.workHoursStart);
        wakeUpTime.setMinutes(0);
        wakeUpTime.setSeconds(0);
        wakeUpTime.setTime(wakeUpTime.getTime() - 10000);
        currentSleepTime =  Math.round((wakeUpTime - new Date()) / 60000);
      } else if (wakeUpTime.getHours() >= powerOptions.workHoursEnd) {
        wakeUpTime.setHours(powerOptions.workHoursEnd);
        wakeUpTime.setMinutes(0);
        wakeUpTime.setSeconds(0);
        if (wakeUpTime <= new Date(new Date().valueOf() + 420000)) {
          wakeUpTime.setDate(wakeUpTime.getDate() + 1);
          wakeUpTime.setHours(powerOptions.workHoursStart);
        }
        wakeUpTime.setTime(wakeUpTime.getTime() - 300000);
        currentSleepTime = Math.round((wakeUpTime - new Date()) / 60000);
      }*/
      sender({ "type": "info", "event": "sleep", "time": currentSleepTime, initTimeSleep, "cost": powerParams.costQuant.toFixed(4), "date": (new Date).toISOString() });
      setTimeout(() => {
        hwComm.shutdown(currentSleepTime);
      }, 5000);/*
    } else {
      sender({ "type": "info", "event": "notice", "message": "sleep time small, no sleep", "lifeAllTime": lifeAllTime, "date": (new Date).toISOString() });
      startMeasure = true;
    }
  } else {
    sender({ "type": "info", "event": "warn", "message": "life to time gone", "lifeToTime": powerParams.lifeToTime, "date": (new Date).toISOString() });
  }*/
}

init();

module.exports.addVolt = (volt) => {
  if (volt !== undefined) {
    if (startMeasure) {
      startVolt = volt;
      startMeasure = false;
      setTimeout(() => {
        final();
      }, powerOptions.workTime);
    } else {
      currentVolt = volt;
    }
  }
}

module.exports.voltToCharge = voltToCharge;
