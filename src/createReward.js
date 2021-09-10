const xdai = require('./lib/xdai');
const utils = require('./lib/utils');
module.exports.handler = async function handler(event, context, callback) {
  const rewardObj = event.body && JSON.parse(event.body);
  console.log(JSON.stringify(event));
  if (!rewardObj) {
    callback(null, utils.createHttpResponse(400, {message: 'Bad request - No reward information passed'}));
  }
  else{
    const result = await xdai.createXDAILink(rewardObj)
    .then((result) => {
      const body = {rewardObj: rewardObj}
      callback(null, utils.createHttpResponse(201, body));
    })
    .catch((error) => {
      console.log('Error promise resolved');
      callback(null, utils.createHttpResponse(500, {message: 'Server error during creation of xDAI reward link - ' + error }));
    });     
  }
}
