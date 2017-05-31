const { taskConfig, taskParams } = require('./taskConfig');
const { power, activeTasksFile } = require('./options');
const powerManager = require('./powerManager');
const startVolt = powerManager.voltToCharge(powerManager.startVolt);
const minWorkCharge = powerManager.voltToCharge(power.minWorkCharge);
const sender = require('./sender');
const hwComm = require('./hwComm');
const fs = require('fs');

const sessionSchedule = [];

const schedule = () => {
  fs.readFile(activeTasksFile, (err, data) => {
    if (err) { throw err; } else {
      activeTasks = JSON.parse(data);
      console.log(startVolt);
      console.log(minWorkCharge);

			let calcCharge = startVolt;
			let workTime = 0;
			for (let activeTask of activeTasks) {
				if ((activeTask.params[0] === 1) && (calcCharge >= minWorkCharge)) {
					if ((calcCharge - taskConfig[activeTask.taskID].cost) >= minWorkCharge) {
						sessionSchedule.push(activeTask);
						console.log('push1');
						calcCharge -= taskConfig[activeTask.taskID].cost;
						if (activeTask.params[2] !== undefined) {
							workTime += activeTask.params[2];
						} else {
							workTime += 0.1;
						}
					}
				}
			}
			for (let activeTask of activeTasks) {
				if ((activeTask.params[0] === 0) && (calcCharge >= minWorkCharge)) {
					if ((calcCharge - taskConfig[activeTask.taskID].cost) >= minWorkCharge) {
						sessionSchedule.push(activeTask);
						console.log('push2');
						calcCharge -= taskConfig[activeTask.taskID].cost;
						if (activeTask.params[2] !== undefined) {
							workTime += activeTask.params[2];
						} else {
							workTime += 0.1;
						}
					}
				}
			}
      console.log(calcCharge);
			//sender.sendSessionSchedule(sessionSchedule);
			doSchedule(sessionSchedule);

    }
  });
}

module.exports.schedule = schedule;

const doSchedule = (schedule) => {
	console.log(schedule);
	/*const queueCount = 0;
	//положить распиание в жрунал
	schedule.forEach((task) => {
		//task.startTime = new Date();
		hwComm[taskConfig[task.taskID].exec](task, (err, task, result) => {
			if (err) {
				task.error = err;
			}/* else {
				task.endTime = new Date();
			}*/
			//положить (время нач/конец, вольтаж нач/конец, ошибки)
			/*queueCount--;
			if (result)	{ sender.sendResult(result); }
			if (queueCount === 0) {
				//отправить отчёт
				powerManager.final();
			}
		});
		queueCount++;
	});*/
}
