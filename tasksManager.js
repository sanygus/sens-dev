const { taskConfig, taskParams } = require('./taskConfig');
const powerManager = require('./powerManager');
const workTime = powerManager.workTime();
const hwComm = require('./hwComm');

const activeTasks = {
	0: {
		serverID: 'fdfsfrgdgff',
		userID: 'dgertjuyuihytgh',
		taskID: '321',
		params: { 0: 1 }
	}
};
const sessionSchedule = [];

const schedule = () => {
	let calcTime = 0;
	for (activeTask in activeTasks) {
		if (activeTasks.activeTask.params.0 === 1) {
			sessionSchedule.push(activeTasks.activeTask);
			calcTime += taskConfig.activeTask.cost;
		}
	}
	if (calcTime >= workTime) {
		powerManager.correctWorkTime(calcTime);
	} else if (calcTime < workTime) {
		for (activeTask in activeTasks) {
			if (activeTasks.activeTask.params.0 === 0) {
				calcTime += taskConfig.activeTask.cost;
				if (calcTime < workTime) {
					sessionSchedule.push(activeTasks.activeTask);
				} else {
					calcTime -= taskConfig.activeTask.cost;
				}
			}
		}
	}
	doSchedule(sessionSchedule);
}

const doSchedule = (schedule) => {
	//const secondQueue = [];
	const firtQueueCount = 0;
	schedule.forEach((task) => {
		//if (taskConfig[task.taskID].sending === 1) {
			task.startTime = new Date();
			hwComm[taskConfig[task.taskID].exec](task, (err, task) => {
				if (err) {
					task.error = err;
				} else {
					task.endTime = new Date();
				}
				firtQueueCount--;
				//send result to server
				sender.sendResult();
				//if (firtQueueCount === 0) { doSecondQueue(secondQueue); }
			});
			firtQueueCount++;
		/*} else {
			secondQueue.push(task);
		}*/
	});
	sender.sendBufferToServer();
}
/*
const doSecondQueue = (queue) => {
	queue.forEach((task) => {
		//собрать пакеты по серварм и пользователям
	})
}*/
