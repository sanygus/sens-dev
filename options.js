module.exports = {
  idDev: 'asdw2',
  sensorsInterval: 0.3,
  hwPath: '../sens-dev-hw',
  server: {
    host: 'localhost',
    port: 1234,
    path: '/dev'
  },
  dataKeeperFile: 'tmpsensors.db',
  powerManagerFile: 'powerParams.dat',
  activeTasksFile: 'activeTasks.dat',
  power: {
    defaultWorkTime: 3,
    maxCharge: 1023,
    minCharge: 856,
    minWorkCharge: 870,
    workHoursStart: 9,
    workHoursEnd: 17,
  }
}