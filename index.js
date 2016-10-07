const sender = require('./sender.js');
const sensRead = require('./sensRead.js');

sensRead((err, values) => {
  if(err) { throw err } else {
    console.log(values);
  }
})
sender({abc: 'def', val: 1.234}, (err) => {
  if(err) { throw err /*fail*/ } else {
    console.log('okay');
  }
})
