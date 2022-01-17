const contractkit = require('@celo/contractkit');
const faucetStorage = require('./faucetStorage');
const utils = require('./utils');
const { v4: uuidv4 } = require('uuid');
const NODE_URL = process.env.NODE_PROVIDER;
const REGION = process.env.AWS_REGION;
const SECRET_NAME = process.env.PRIVATE_KEY_SECRET_NAME;
const FAUCET_AMOUNT = process.env.DEFAULT_FAUCET_VALUE;
module.exports.createFaucetRequest = (faucetRequest) => {
    faucetRequest["requestId"] = uuidv4();
    faucetRequest["createdTimestamp"] = utils.getTimestamp();
    faucetRequest["status"] = "REQUESTED";
    return faucetStorage.create(faucetRequest);
}
module.exports.claimFaucetRequest = async (faucetRequest) => {
    console.log('************ Faucet claim start ****************');
    console.log(JSON.stringify(faucetRequest));
    try{
        const kit = contractkit.newKit(NODE_URL);
        const privateKey = utils.getSecret(SECRET_NAME, REGION);
        await kit.addAccount(privateKey);
        const accounts = await kit.web3.eth.getAccounts();
        const account = accounts[0];
        const goldtoken = await kit.contracts.getGoldToken()
        const faucetAmt = kit.web3.utils.toWei(FAUCET_AMOUNT, 'ether');
        const tx = await goldtoken.transfer(faucetRequest.address, faucetAmt).send({from: account});
        const receipt = await tx.waitReceipt();
        console.log(`Transaction created, sent ${FAUCET_AMOUNT} cGLD to ${faucetRequest.address}}`);
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
