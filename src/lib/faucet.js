const Web3 = require('web3');
const contractkit = require('@celo/contractkit');
const faucetStorage = require('./faucetStorage');
const utils = require('./utils');
const NODE_URL = process.env.NODE_PROVIDER;
const REGION = process.env.AWS_REGION;
const SECRET_NAME = process.env.PRIVATE_KEY_SECRET_NAME;
module.exportscreateFaucetRequest = (faucetRequest) => {
    faucetRequest["createdTimestamp"] = utils.getTimestamp();
    faucetRequest["status"] = "REQUESTED";
    return faucetStorage.create(faucetRequest);
}
getAccount = () => {
    var web3 = new Web3();
    const privateKey = utils.getSecret(SECRET_NAME, REGION);
    return web3.eth.accounts.privateKeyToAccount(privateKey);
}
module.exports.claimFaucetRequest = (faucetRequest) => {
    console.log('************ Faucet claim start ****************');
    console.log(JSON.stringify(faucetRequest));
    try{
        const account = await getAccount();
        const kit = contractkit.newKit(NODE_URL);
        kit.addAccount(account.privateKey);
        const goldtoken = await kit.contracts.getGoldToken()
        const oneGold = kit.web3.utils.toWei('1', 'ether');
        const tx = await goldtoken.transfer(faucetRequest.address, oneGold).send({from: account.address})
        const receipt = await tx.waitReceipt()
        console.log(`Transaction created, sent 1 cGLD to ${faucetRequest.address}}`);
        console.log(receipt);
        const balance = await goldtoken.balanceOf(account.address);
        console.log(`Balance of funding account is now ${balance.toString()}`);
        faucetRequest["status"] = "CLAIMED";
        faucetRequest["claimedTimestamp"] = utils.getTimestamp();
        await faucetStorage.update(faucetRequest);        
    }
    catch(error){
        console.log('Error creating transaction for faucet. Claim may not have been processed: ' + error);
        throw error;
    }
    console.log('************ Faucet claim end ****************');
    return faucetRequest;
}
