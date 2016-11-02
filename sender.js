const http = require('http');
const options = require('./options');

module.exports = (values, callback) => {//values in JSON { par1: 'value' }
  let getQuery = `iddev=${options.idDev}&`;
  for(key in values) {
    getQuery += `${key}=${values[key]}&`;
  }
  http.get({
    hostname: options.server.host,
    port: options.server.port,
    path: options.server.path + '?' + getQuery,
    agent: false
  }, (res) => {
    let error = null;
    res.on('data', (data) => {
      if(res.statusCode !== 200 || JSON.parse(data).status !== 'ok') {
        error = new Error('err in answ');
      }
    });
    res.on('end', () => {
      callback(error);
    })
  }).on('error', (e) => {
    callback(e);
  })
}
