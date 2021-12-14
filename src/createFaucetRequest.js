const faucet = require('./lib/faucet');
const utils = require('./lib/utils');
const faucetStorage = require('./lib/faucetStorage');
const web3utils = require('web3-utils');
const BURN_ADDRESS='0x0000000000000000000000000000000000000000'
module.exports.handler = async function handler(event, context, callback) {
  const faucetRequest = event.body && JSON.parse(event.body);
  console.log(JSON.stringify(event));
  if (!faucetRequest) {
    callback(null, utils.createHttpResponse(400, {message: 'Body cannot be empty'}));
  }
  if(!isValidAddress(faucetRequest.address)){
    const message = `'Address ${faucetRequest.address} is not valid`;
    callback(null, utils.createHttpResponse(400, {message: message}));
  }
  if(faucet.address == BURN_ADDRESS){
    callback(null, utils.createHttpResponse(400, {message: "No burning"}));
  }
  try{    
    const queue = await faucetStorage.getAll();
    addressAlreadyInQueue = faucetStorage.filter((request)=>request.address==faucetRequest.address)[0];
    if(addressAlreadyInQueue){
      const message = `'Address ${faucetRequest.address} is already in the queue`;
      callback(null, utils.createHttpResponse(400, {message: message}));
    }
    const result = await faucet.createFaucetRequest(faucetRequest);
    const body = {message: "Requested"}
    callback(null, utils.createHttpResponse(201, body));    
  }
  catch(error) {
      console.log('Error promise resolved');
      callback(null, utils.createHttpResponse(500, {message: 'Server error during faucet request - ' + error }));
  };
}
function isValidAddress (address) {
  return web3utils.isAddress(address)
}
