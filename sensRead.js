
module.exports = (callback) => {
  let values = {};
  let error = null;

  //magic, magic
  values.temp = 34;

  callback(error, values);
}