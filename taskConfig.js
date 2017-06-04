module.exports.taskConfig = {
	1: {
		name: 'считать и отправить показания датчиков',
		exec: 'sensRead',
		cost: 0.7,
		params: [ 0 ],
	},
	2: {
		name: 'собрать и отправить статистику сна',
		exec: 'getSleepStat',
		cost: 0.02,
		params: [],
	},
	3: {
		name: 'заснуть',
		exec: 'goShutdown',
		cost: 0.02,
		params: [ 0, 1 ]
	},
	4: {
		name: 'снять фото и отправить',
		exec: 'shotAndSendPhoto',
		cost: 0.1,
		params: [ 0 ],
	},
	5: {
		name: 'видео поток',
		exec: 'startStream',
		cost: 0.1,
		params: [ 0, 2 ]
	},
	6: {
		name: 'отправить конфиг задач на сервер',
		exec: '',
		cost: 0.1,
		params: [ 0 ],
	},
	7: {
		name: 'загрузить задания с сервера',
		exec: '',
		cost: 0.1,
		params: [ 0 ],
	},

}
module.exports.taskParams = {
	0: {
		name: 'приоритет',
		type: 'bool',
		default: 1,
	},
	1: {
		name: 'время сна',
		type: 'int',
		default: 10,
	},
	2: {
		name: 'длительность',
		type: 'int',
		default: 1,
	}
}
/*{
	serverID: 'UGsdfygskudvfKKSDfvsd',
	userID: 'sdfsdf',
	tasks: [
		{
			id: 1,
			params: [ { id: 0, value: true } ]
		}
	]
}*/