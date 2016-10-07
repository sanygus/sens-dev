const http = require('http');

module.exports = (values, callback) => {//values in JSON { par1: 'value' }
  let getQuery = '';
  for(key in values) {
    getQuery += `${key}=${values[key]}&`;
  }
  http.get({
    hostname: 'localhost',
    port: 1234,
    path: '/?' + getQuery,
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
