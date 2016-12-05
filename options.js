module.exports = {
  idDev: 'asdw2',
  sensorsInterval: 10000,
  hwPath: '../sens-dev-hw',
  server: {
    host: 'localhost',
    port: 1234,
    path: '/dev'
  },
  dataKeeperFile: 'tmpsensors.db',
  powerManagerFile: 'volts.db',
  power: {
    cycleTime: 2 * 60 * 1000,
    maxCharge: 1023,
    minCharge: 856,
  }
}