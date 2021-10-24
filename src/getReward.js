const reward = require('./lib/rewardStorage');
const utils = require('./lib/utils');
module.exports.handler = async (event, context, callback) => {
  await reward.getAll()
    .then((result) => {
      const parsedResult = ((result && result.Items || []));  
      const sortedResults = parsedResult.sort((a,b) => {return a.createdTimestamp - b.createdTimestamp});
      const body = {rewards: sortedResults[sortedResults.length-1]};
      console.log('Response body = ' + JSON.stringify(body));
      callback(null, utils.createHttpResponse(200, body));
    })
    .catch((error) => {
      console.log('Error promise resolved');
      callback(null, utils.createHttpResponse(500, {message: 'Server error during retrieval of all results - ' + error }));
    }); 
}
