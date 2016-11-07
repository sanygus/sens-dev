const sender = require('./sender');
const hwComm = require('./hwComm');
const dataKeeper = require('./dataKeeper');
const powerManger = require('./powerManager');
const log = require('./log');

powerManger.init();

hwComm.sensRead((err, values) => {
  if (err) { log(err); }
  if (values && (values.volt)) {
    powerManger.addVolt(values.volt); 
    delete(values.volt);
  }
  sender(values);
});
/*hwComm.sigSleep(1, (err, success) => {
  if (err) { log(err) }
  console.log(success);
})*/
