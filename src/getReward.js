const reward = require('./lib/rewardStorage');
const utils = require('./lib/utils');
module.exports.handler = async (event, context, callback) => {
  const limitParameterProvided = event.queryStringParameters ? (event.queryStringParameters.limit ? true : false) : false;
  console.log("Query parameters are " + JSON.stringify(event.queryStringParameters));    
  await reward.getAll()
    .then((result) => {
      let parsedResult = ((result && result.Items || []));  
      let sortedResults = parsedResult.sort((a,b) => {return a.createdTimestamp - b.createdTimestamp});   
      if(limitParameterProvided){
        sortedResults = sortedResults.filter((item,index) => {return index>=(sortedResults.length - event.queryStringParameters.limit)});
        console.log('Results limited to last ' + event.queryStringParameters.limit + ' items...');
      }      
      const body = {rewards: sortedResults };
      console.log('Response body = ' + JSON.stringify(body));
      callback(null, utils.createHttpResponse(200, body));
    })
    .catch((error) => {
      console.log('Error promise resolved');
      callback(null, utils.createHttpResponse(500, {message: 'Server error during retrieval of all results - ' + error }));
    }); 
}
