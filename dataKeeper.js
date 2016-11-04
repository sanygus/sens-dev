const fs = require('fs');
const { dataKeeperFile: fileName } = require('./options');

module.exports.add = (obj, callback) => {
  fs.appendFile(fileName, JSON.stringify(obj) + '\n', callback);
}

module.exports.get = (callback) => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if ((err) || !(data.indexOf('{') < data.indexOf('}'))) {
      callback(err || new Error('no objects in file'))
    } else {
      callback(null, JSON.parse(data.substring(data.lastIndexOf('\n', data.length - 2), data.length - 1)));
    }
  });
}

module.exports.dataAvailable = (callback) => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if ((!err) && (data.indexOf('{') < data.indexOf('}')) && (data[data.length - 1] === '\n')) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

module.exports.del = (callback) => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) { callback(err); } else {
      fs.writeFile(fileName, data.substring(0, data.lastIndexOf('\n', data.length - 2) + 1), (err) => {
        if (err) { callback(err); } else {
          callback(null);
        }
      });
    }
  });
}
