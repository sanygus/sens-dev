const { taskConfig, taskParams } = require('./taskConfig');
const { power.minWorkCharge: minWorkCharge, activeTasksFile } = require('./options');
const powerManager = require('./powerManager');
const sender = require('./sender');
const startVolt = powerManager.startVolt;
const hwComm = require('./hwComm');
const fs = require('fs');

const sessionSchedule = [];

const schedule = () => {
    fs.readFile(activeTasksFile, (err, data) => {
      if (err) {
        throw err;
      } else {
        activeTasks = JSON.parse(data);
      }
    });
	let calcCharge = startVolt;
	let workTime = 0;
	for (activeTask in activeTasks) {
		if ((activeTasks.activeTask.params.0 === 1) && (calcCharge >= minWorkCharge)) {
			if (calcCharge >= minWorkCharge) {
				sessionSchedule.push(activeTasks.activeTask);
				calcCharge -= taskConfig.activeTask.cost;
				if (activeTasks.activeTask.params.2 !== undefined) {
					workTime += activeTasks.activeTask.params.2;
				} else {
					workTime += 0.1;
				}
			}
		}
	}
	if (calcCharge >= minWorkCharge) {
		for (activeTask in activeTasks) {
			if ((activeTasks.activeTask.params.0 === 0) && (calcCharge >= minWorkCharge)) {
				if (calcCharge >= minWorkCharge) {
					sessionSchedule.push(activeTasks.activeTask);
					calcCharge -= taskConfig.activeTask.cost;
					if (activeTasks.activeTask.params.2 !== undefined) {
						workTime += activeTasks.activeTask.params.2;
					} else {
						workTime += 0.1;
					}
				}
			}
		}
	}
	sender.sendSessionSchedule(sessionSchedule);
	doSchedule(sessionSchedule);
}

module.exports.schedule = schedule;

const doSchedule = (schedule) => {
	const queueCount = 0;
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
			queueCount--;
			if (result)	{ sender.sendResult(result); }
			if (queueCount === 0) {
				//отправить отчёт
				powerManager.final();
			}
		});
		queueCount++;
	});
}
