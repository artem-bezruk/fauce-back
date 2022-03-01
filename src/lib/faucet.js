const contractkit = require('@celo/contractkit');
const faucetStorage = require('./faucetStorage');
const utils = require('./utils');
const { v4: uuidv4 } = require('uuid');
const NODE_URL = process.env.NODE_PROVIDER;
const REGION = process.env.AWS_REGION;
const SECRET_NAME = process.env.PRIVATE_KEY_SECRET_NAME;
const FAUCET_AMOUNT = process.env.DEFAULT_FAUCET_VALUE;
module.exports.faucetBalance = async () => {
    console.log('************ Faucet balance request start ****************');
    const kit = contractkit.newKit(NODE_URL);
    const privateKey = await utils.getSecret(SECRET_NAME, REGION);
    kit.addAccount(privateKey);
    const accounts = await kit.web3.eth.getAccounts();
    const account = accounts[0];
    console.log('Faucet source is account ' + account);
    const goldtoken = await kit.contracts.getGoldToken();       
    const balance = await goldtoken.balanceOf(account);
    console.log('************ Faucet balance request end ****************');
    return balance;
}
module.exports.createFaucetRequest = async (faucetRequest) => {
    console.log('************ Faucet request start ****************');
    console.log(JSON.stringify(faucetRequest));
    faucetRequest["requestId"] = uuidv4();
    const blockNumber = await utils.getCurrentBlockNumber();
    faucetRequest["createdBlockNumber"] = blockNumber;
    faucetRequest["status"] = "REQUESTED";
    console.log('************ Faucet request end ****************');
    return faucetStorage.create(faucetRequest);
}
module.exports.claimFaucetRequest = async (faucetRequest) => {
    console.log('************ Faucet claim start ****************');
    console.log(JSON.stringify(faucetRequest));
    try{
        const kit = contractkit.newKit(NODE_URL);
        const privateKey = await utils.getSecret(SECRET_NAME, REGION);
        kit.addAccount(privateKey);
        const accounts = await kit.web3.eth.getAccounts();
        const account = accounts[0];
        console.log('Faucet source is account ' + account);
        const goldtoken = await kit.contracts.getGoldToken();       
        const faucetAmt = await kit.web3.utils.toWei(FAUCET_AMOUNT, 'ether');       
        console.log(`Attempting - await goldtoken.transfer(${faucetRequest.address}, ${faucetAmt}).send({from: ${account}})`);
        const tx = await goldtoken.transfer(faucetRequest.address, faucetAmt).send({from: account});
        const receipt = await tx.waitReceipt();        
        console.log(`Transaction sent, sent ${FAUCET_AMOUNT} cGLD to ${faucetRequest.address}}`);
        console.log(receipt);
        const balance = await goldtoken.balanceOf(account);
        console.log(`Balance of funding account is now ${balance.toString()}`);
        faucetRequest["status"] = "CLAIMED";
        faucetRequest["claimedBlockNumber"] = receipt.blockNumber;
        faucetRequest["txId"] = receipt.transactionHash;
        await faucetStorage.update(faucetRequest);
    }
    catch(error){       
        console.log('Error creating transaction for faucet. Claim may not have been processed: ' + error);
        try{
            console.log("Attempting to set request back to 'REQUESTED'");
            faucetRequest["status"] = "REQUESTED";
            await faucetStorage.update(faucetRequest);
        }
        catch(error){
            console.log(error);
        }
        throw error; 
    }
    console.log('************ Faucet claim end ****************');
    return faucetRequest;
}
