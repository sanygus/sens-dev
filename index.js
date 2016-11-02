const sender = require('./sender');
const hwComm = require('./hwComm');
const log = require('./log');

hwComm.sensRead((err, values) => {
  if (err) { log(err); }
  sender(values, (err) => {
    if (err) {
      log(err);
      /*fail*/
    } else {
      console.log('okay');
    }
  })
})
/*hwComm.sigSleep(1, (err, success) => {
  if (err) { log(err) }
  console.log(success);
})*/
