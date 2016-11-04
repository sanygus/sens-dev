const sender = require('./sender');
const hwComm = require('./hwComm');
const dataKeeper = require('./dataKeeper');
const log = require('./log');

hwComm.sensRead((err, values) => {
  if (err) { log(err); }
  sender(values);
})
/*hwComm.sigSleep(1, (err, success) => {
  if (err) { log(err) }
  console.log(success);
})*/
