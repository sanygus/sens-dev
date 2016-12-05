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
  //anlysis volts []
  const workingTime = (new Date()) - startDate; // ms
  const lastCharge = voltToCharge(volts[volts.length - 1]);
  if (lastCharge > 0.95) {
    
  } else {
    if (workingTime >= powerOptions.cycleTime * lastCharge) {
      hwComm.shutdown(powerOptions.cycleTime * (1 - lastCharge));
    } else {
      console.log('work next ' + workingTime);
    }
  }
}

const voltToCharge = (volt) => {
  let charge = 0;
  if (volt > powerOptions.maxCharge) {
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
  volts.push(volt);
  fs.writeFile(fileName, JSON.stringify(volts), log);
  analysisDecide();
}

init();
