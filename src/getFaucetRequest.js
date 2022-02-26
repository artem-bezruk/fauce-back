const faucet = require('./lib/faucet');
const faucetStorage = require('./lib/faucetStorage');
const utils = require('./lib/utils');
module.exports.handler = async (event, context, callback) => {
  try {
    const result = await faucetStorage.getAll();
    const parsedResult = ((result && result.Items || []));
    const sortedResults = parsedResult.sort((a, b) => {
      return a.createdTimestamp - b.createdTimestamp
    });
    const faucetBalance = faucet.getFaucetBalance();
    const body = {
      faucetRequests: sortedResults,
      faucetBalance: faucetBalance
    };
    console.log('Response body = ' + JSON.stringify(body));
    callback(null, utils.createHttpResponse(200, body));
  } catch (error) {
    console.log('Error promise resolved');
    callback(null, utils.createHttpResponse(500, {
      message: 'Server error during retrieval of all results - ' + error
    }));
  };
}
