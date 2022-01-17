const faucet = require('./lib/faucet');
const utils = require('./lib/utils');
const faucetStorage = require('./lib/faucetStorage');
const REQUEST_COOLDOWN = 100 * 1000; 
module.exports.handler = async function handler(event, context, callback) {
  const faucetRequest = event.body && JSON.parse(event.body);
  console.log(JSON.stringify(event));
  if (!faucetRequest) {
    callback(null, utils.createHttpResponse(400, {
      message: 'Body cannot be empty'
    }));
  }
  try {
    const queue = await faucetStorage.getAll();
    queuedRequest = faucetStorage.filter((request) => request.address == faucetRequest.address)[0];
    if (!queuedRequest) {
      const message = `'Address ${faucetRequest.address} is already in the queue`;
      callback(null, utils.createHttpResponse(400, {
        message: message
      }));
    }
    const currentTimestamp = utils.getTimestamp();
    if ((currentTimestamp - queuedRequest.createdTimestamp) < REQUEST_COOLDOWN) {
      const message = `'Request ${faucetRequest.address} is still cooling down, please wait ${Math.round((currentTimestamp - queuedRequest.createdTimestamp)/1000)} more seconds before claiming`;
      callback(null, utils.createHttpResponse(400, {
        message: message
      }));
    }
    const result = await faucet.claimFaucetRequest(faucetRequest);
    const body = {
      claimResult: result
    };
    callback(null, utils.createHttpResponse(200, body));
  } catch (error) {
    console.log('Error promise resolved');
    callback(null, utils.createHttpResponse(500, {
      message: 'Server error during faucet claim - ' + error
    }));
  };
}
