const sender = require('./sender');
const hwComm = require('./hwComm');
const dataKeeper = require('./dataKeeper');
const powerManger = require('./powerManager');
const log = require('./log');
const { sensorsInterval } = require('./options');

setInterval(() => {
  hwComm.sensRead((err, values) => {
    if (err) { log(err); }
    if (values) {
      if (values.volt !== undefined) {
        powerManger.addVolt(values.volt);
        values.charge = powerManger.voltToCharge(values.volt);
      }
      sender(values);
    }
  });
  setTimeout(() => {
    hwComm.shotAndSendPhoto();
  }, 5000);
}, sensorsInterval);

setTimeout(() => {
  sender({ "type": "info", "event": "wakeup", "date": new Date((new Date).valueOf() - 5000).toISOString() });
}, 5000);

/*hwComm.sigSleep(1, (err, success) => {
  if (err) { log(err) }
  console.log(success);
})*/
