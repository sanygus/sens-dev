const { powerManagerFile: fileName, power: powerOptions } = require('./options');
const hwComm = require('./hwComm');
const sender = require('./sender');
const log = require('./log');
const fs = require('fs');
let powerParams = {};
let currentVolt = null;
let startVolt = null;
let startMeasure = true;
//const startDate = new Date();

const init = () => {
  fs.readFile(fileName, (err, data) => {
    if (err) {
      throw err;
    } else {
      powerParams = JSON.parse(data);
    }
  })
  //setInterval(analysisDecide, 10000);
}

/*const analysisDecide = () => {
  const workingTime = (new Date()) - startDate; // ms
  const lastCharge = voltToCharge(volts[volts.length - 1]);
  if (lastCharge > 0.95) {
    // working
  } else {
    if (workingTime >= powerOptions.cycleTime * lastCharge) {
      hwComm.shutdown(powerOptions.cycleTime * (1 - lastCharge));
    }
  }
}*/

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
    fs.writeFile(fileName, JSON.stringify(powerParams), log);
  }
  const lifeAllTime = (new Date(powerParams.lifeToTime) - new Date()) / 60000;
  if(lifeAllTime > 0) {
    currentSleepTime = Math.round((lifeAllTime * powerParams.costQuant) / voltToCharge(currentVolt));
    if (currentSleepTime > 1) {
      sender({ "type": "info", "event": "sleep", "time": currentSleepTime, "cost": powerParams.costQuant.toFixed(4), "date": (new Date).toISOString() });
      setTimeout(() => {
        hwComm.shutdown(currentSleepTime);
      }, 5000);
    } else {
      sender({ "type": "info", "event": "notice", "message": "sleep time small, no sleep", "lifeAllTime": lifeAllTime, "date": (new Date).toISOString() });
      startMeasure = true;
    }
  } else {
    sender({ "type": "info", "event": "warn", "message": "life to time gone", "lifeToTime": powerParams.lifeToTime, "date": (new Date).toISOString() });
  }
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
    /*if (endMeasure) {
      voltEnd = volt;
      fs.writeFile(fileName, JSON.stringify({voltLastEnd: voltEnd}), log);
      endMeasure = false;
    }*/
    //volts.push(volt);
    //fs.writeFile(fileName, JSON.stringify(volts), log);
  }
}

module.exports.voltToCharge = voltToCharge;
