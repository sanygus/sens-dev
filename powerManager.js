const { powerManagerFile: fileName, power: powerOptions } = require('./options');
const hwComm = require('./hwComm');
const log = require('./log');
const fs = require('fs');
const volts = [];
const startDate = new Date();

const init = () => {
  fs.readFile(fileName, (err, data) => {
    if (err) {
      if (err.code !== "ENOENT") {
        log(err);
      }
    } else {
      const voltsFromFile = JSON.parse(data);
      if (Array.isArray(voltsFromFile)) {
        volts.unshift(...voltsFromFile);
      } else {
        log(new Error('no array in file ' + fileName));
      }
    }
  })
  setInterval(analysisDecide, 10000);
}

const analysisDecide = () => {
  const workingTime = (new Date()) - startDate; // ms
  const lastCharge = voltToCharge(volts[volts.length - 1]);
  if (lastCharge > 0.95) {
    // working
  } else {
    if (workingTime >= powerOptions.cycleTime * lastCharge) {
      hwComm.shutdown(powerOptions.cycleTime * (1 - lastCharge));
    } else {
      // working
      // console.log('work next ' + workingTime);
    }
  }
}

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
  console.log(volt, charge);
  return charge;
}

module.exports.addVolt = (volt) => {
  if (volt !== undefined) {
    volts.push(volt);
    fs.writeFile(fileName, JSON.stringify(volts), log);
  }
  //analysisDecide();
}

init();
