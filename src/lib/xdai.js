const Web3 = require('web3');
const linkAbi = require('../abis/Links.json');
const reward = require('./rewardStorage');
const utils = require('./utils');
const LINK_XDAI_CONTRACT_ADDRESS = process.env.LINK_XDAI_CONTRACT_ADDRESS;
const ZERO_ADDRESS = process.env.ZERO_ADDRESS;
const RELAY_GAS_PRICE = process.env.RELAY_GAS_PRICE;
const GAS_LIMIT = process.env.GAS_LIMIT;
const BURNER_WALLET_HOST = process.env.BURNER_WALLET_HOST;
const WEB3_HTTPS_PROVIDER = process.env.WEB3_HTTPS_PROVIDER;
getWeb3 = () => {
    return new Web3(new Web3.providers.HttpProvider(WEB3_HTTPS_PROVIDER));
}
getContract = (web3) => {
    const contract = new web3.eth.Contract(linkAbi, LINK_XDAI_CONTRACT_ADDRESS);
    return contract;
}
const getClaimUrl = (claimId, claimKey) => `${BURNER_WALLET_HOST}/${claimId};${claimKey}`;
createLink = async (web3, ether) => {
    const EthereumTx = require('ethereumjs-tx').Transaction;
    const linkContract = getContract(web3);
    const randomHash = web3.utils.sha3(Math.random().toString());
    const randomWallet = web3.eth.accounts.create();
    console.log(randomHash, randomWallet);
    const sig = web3.eth.accounts.sign(randomHash, randomWallet.privateKey);
    const expirationTime = 2; 
    const wei = web3.utils.toWei(ether.toString(), 'ether');
    console.log(`Sending ${wei} wei xDAI`);
    console.log(`Signature ${JSON.stringify(sig)}`);
    let tokenAddress = ZERO_ADDRESS;
    let value = wei;
    var privateKey = new Buffer(process.env.SOURCE_PRIVATE_KEY, 'hex');
    const nonce = await web3.eth.getTransactionCount(process.env.SOURCE_XDAI_ADDRESS);
    console.log(`nonce: ${nonce}`);
    const data = linkContract.methods.send(randomHash, sig.signature, tokenAddress, wei, expirationTime).encodeABI();
    console.log(`data: ${data}`);
    const Common = require('ethereumjs-common');
    const customCommon = Common.default.forCustomChain(
        'mainnet',
        {
            name: 'xdai',
            networkId: 100,
            chainId: 100,
        },
        'petersburg')    
    var rawTx = {
      nonce: web3.utils.toHex(nonce),
      gasPrice: web3.utils.toHex(RELAY_GAS_PRICE),
      gasLimit: web3.utils.toHex(GAS_LIMIT),
      to: LINK_XDAI_CONTRACT_ADDRESS,
      value: web3.utils.toHex(value),
      data: data,
      chainId: 100
    }    
    var tx = new EthereumTx(rawTx, {common: customCommon});
    tx.sign(privateKey);    
    var serializedTx = tx.serialize();    
    const receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    console.log(`receipt = ${JSON.stringify(receipt)}`);
    const claimUrl = getClaimUrl(randomHash, randomWallet.privateKey);
    return { claimUrl, receipt, randomHash };
}
module.exports.createXDAILink = async function(rewardObj) {
    web3 = getWeb3();
    console.log(JSON.stringify(rewardObj));
    const rewardInXDAI = rewardObj.rewardInXDAI;
    const { claimUrl, receipt, randomHash } = await createLink(web3, rewardInXDAI);
    console.log(`Generated claimUrl = ${claimUrl}, receipt = ${JSON.stringify(receipt)}`);
    rewardObj["claimUrl"] = claimUrl;
    rewardObj["transactionId"] = receipt;
    rewardObj["hashCode"] = randomHash;
    rewardObj["createdTimestamp"] = utils.getEpochFromDateString(new Date());
    await reward.create(rewardObj);
    return rewardObj;
}
