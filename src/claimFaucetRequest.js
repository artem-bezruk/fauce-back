const faucet = require('./lib/faucet');
const utils = require('./lib/utils');
const faucetStorage = require('./lib/faucetStorage');
const REQUEST_COOLDOWN = process.env.DEFAULT_REQUEST_COOLDOWN || 12; 
module.exports.handler = async function handler(event, context, callback) {
  const faucetRequest = event.body && JSON.parse(event.body);
  console.log(JSON.stringify(event));
  if (!faucetRequest) {
    callback(null, utils.createHttpResponse(400, {
      message: 'Body cannot be empty'
    }));
  } else {
    try {
      const result = await faucetStorage.getAll();
      const queue = result && result.Items || [];
      const blockNumber = await utils.getCurrentBlockNumber();
      queuedRequest = queue.filter((request) => request.address == faucetRequest.address)[0];
      if (!queuedRequest) {
        const message = `Address ${faucetRequest.address} is not in the queue`;
        callback(null, utils.createHttpResponse(400, {
          message: message
        }));
      } else if (queuedRequest.status === 'CLAIMED') {
        const message = `Address ${faucetRequest.address} is not in the queue`;
        callback(null, utils.createHttpResponse(400, {
          message: message
        }));
      } else if ((blockNumber - queuedRequest.createdBlockNumber) < REQUEST_COOLDOWN) {
          const message = `Request ${faucetRequest.address} is still cooling down, please wait ${(blockNumber - queuedRequest.createdBlockNumber)} more blocks before claiming`;
          callback(null, utils.createHttpResponse(400, {
            message: message
           }));
      } else {
        const claimResult = await faucet.claimFaucetRequest(faucetRequest);
        const body = {
          claimResult: claimResult
        };
        callback(null, utils.createHttpResponse(200, body));        
      }
    } catch (error) {
      console.log('Error promise resolved');
      callback(null, utils.createHttpResponse(500, {
        message: 'Server error during faucet claim - ' + error
      }));
    };
  }  
}
