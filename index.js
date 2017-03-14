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
}, sensorsInterval);

setTimeout(() => {
  hwComm.shotAndSendPhoto((err) => {
    if (err) { log('no take photo'); }
    hwComm.startStream();
  });
}, 15000);

setTimeout(() => {
  sender({ "type": "info", "event": "wakeup", "date": new Date((new Date).valueOf() - 25000).toISOString() });
}, 25000);
