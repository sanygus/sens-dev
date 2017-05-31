const sender = require('./sender');
const hwComm = require('./hwComm');
const dataKeeper = require('./dataKeeper');
const powerManger = require('./powerManager');
const taskManager = require('./taskManager');
const log = require('./log');
const fs = require('fs');
const { sensorsInterval, activeTasksFile } = require('./options');

const activeTasks = {};
fs.readFile(activeTasksFile, (err, data) => {
  if (err) {
    throw err;
  } else {
    activeTasks = JSON.parse(data);
  }
});

setInterval(() => {
  hwComm.sensRead((err, values) => {
    if (values) {
      if (values.volt !== undefined) {
        powerManger.addVolt(values.volt);
        sender.getTasks((err, tasks) => {
          tasks.forEach((task) => {
            activeTasks[`${task.serverID}_${$task.userID}`] = { tasks: task.tasks };
          });
          fs.writeFile(activeTasksFile, JSON.stringify(activeTasks), (err) => {
            taskManager.sendule();
          });
        });
      }
    }
    //values
  });
}, sensorsInterval * 60000);

/*setInterval(() => {
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
}, sensorsInterval * 60000);

setTimeout(() => {
  hwComm.shotAndSendPhoto((err) => {
    if (err) { log('no take photo'); }
    hwComm.startStream();
  });
}, 15000);

setTimeout(() => {
  sender({ "type": "info", "event": "wakeup", "date": new Date((new Date).valueOf() - 25000).toISOString() });
  hwComm.getSleepStat((err, stat) => {
    if (err) { log(`getStatError ${err}`); } else {
      sender({ "type": "info", "event": "stat", "data": JSON.stringify(stat), "date": new Date((new Date).valueOf() - 25000).toISOString() });
    }
  });
}, 25000);*/
