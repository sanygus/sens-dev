const { powerManagerFile: fileName } = require('./options');
const log = require('./log');
const fs = require('fs');
const volts = [];

module.exports.init = () => {
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
}

module.exports.addVolt = (volt) => {
  volts.push(volt);
  fs.writeFile(fileName, JSON.stringify(volts), log);
  analysisDecide();
}

const analysisDecide = () => {
  //anlysis volts []
  console.log(volts);
}
