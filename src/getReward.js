const reward = require('./lib/rewardStorage');
const utils = require('./lib/utils');
module.exports.handler = async (event, context, callback) => {
  const limitParameterProvided = event.queryStringParameters ? (event.queryStringParameters.limit ? true : false) : false;
  console.log("Query parameters are " + JSON.stringify(event.queryStringParameters));    
  await reward.getAll()
    .then((result) => {
      let parsedResult = ((result && result.Items || []));  
      if(limitParameterProvided){
        parsedResult = parsedResult.filter((item,index) => {return index<event.queryStringParameters.limit});
        console.log('Results limited to first ' + event.queryStringParameters.limit + ' items...');
        console.log('parsedResult = ' + JSON.stringify(parsedResult));
      }      
      const body = {rewards: parsedResult };
      console.log('Response body = ' + JSON.stringify(body));
      callback(null, utils.createHttpResponse(200, body));
    })
    .catch((error) => {
      console.log('Error promise resolved');
      callback(null, utils.createHttpResponse(500, {message: 'Server error during retrieval of all results - ' + error }));
    }); 
}
