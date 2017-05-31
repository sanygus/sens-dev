const powerManager = require('./powerManager.js');
const taskManager = require('./taskManager.js');
const { power.minWorkCharge: minWorkCharge } = require('./options');

module.exports.internal = () => {
	hwComm.sensRead((err, values) => {
	    if (err) { log(err); }
	    if (values) {
	      if (values.volt !== undefined) {
	        values.charge = powerManger.voltToCharge(values.volt);
		    powerManager.getPowerParams((powerParams) => {
		      if ((values.charge >= minWorkCharge) && (values.charge >= (powerParams.lastCharge - 0.1))) {
		      	taskManager.schedule();
		      } else {
		      	powerManager.final();
		      }
		    });
	        //powerManger.addVolt(values.volt);
	      }
	      sender.
	    }
    });
}