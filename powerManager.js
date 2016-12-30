const { powerManagerFile: fileName, power: powerOptions } = require('./options');
const hwComm = require('./hwComm');
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
  } else if (volt === 0) {
    charge = 1;
    log('volt no connected!'); // WARN
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

const final = () => {
  if (startVolt > currentVolt) {//доработать
    powerParams.costQuant = voltToCharge(startVolt) - voltToCharge(currentVolt);
    fs.writeFile(fileName, JSON.stringify(powerParams), log);
  }
  currentSleepTime = (powerParams.lifeAllTime * powerParams.costQuant) / voltToCharge(currentVolt);
  hwComm.shutdown(currentSleepTime * 60000);
}

init();
