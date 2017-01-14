module.exports = {
  idDev: 'asdw2',
  sensorsInterval: 25000,
  hwPath: '../sens-dev-hw',
  server: {
    host: 'localhost',
    port: 1234,
    path: '/dev'
  },
  dataKeeperFile: 'tmpsensors.db',
  powerManagerFile: 'powerParams.dat',
  power: {
    workTime: 3 * 60000,
    maxCharge: 1023,
    minCharge: 856,
  }
}