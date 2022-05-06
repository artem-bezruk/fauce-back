const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
}
module.exports.getTimestamp = () => {
    const date = new Date();
    return date.getTime();
}
createHttpResponse = (status, body) => {
    return {
        statusCode: status,
        isBase64Encoded: false,
        headers: defaultHeaders,
        body: JSON.stringify(body)
    };
}
module.exports.createHttpResponse = createHttpResponse;
module.exports.getSecret = async (secretName, region) => {
    const AWS = require('aws-sdk');
    let secret, decodedBinarySecret;
    const client = new AWS.SecretsManager({
        region: region
    });
    try {
        const data = await client.getSecretValue({
            SecretId: secretName
        }).promise();
        if ('SecretString' in data) {
            secret = data.SecretString;
        } else {
            let buff = new Buffer.from(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
        }
    } catch (err) {
        throw err;
    }
    return secret || decodedBinarySecret;
}
module.exports.getCurrentBlockNumber = async () => {
    const NODE_URL = process.env.NODE_PROVIDER || "https:
    const contractkit = require('@celo/contractkit');    
    const kit = contractkit.newKit(NODE_URL);
    const blockNumber = await kit.web3.eth.getBlockNumber();
    return blockNumber;
}
module.exports.sortByRequestedBlock = (flip, data) => {
    data.sort((x, y) => {
      let a = x.createdBlockNumber, b = y.createdBlockNumber;
      if(flip){a = y.createdBlockNumber; b = x.createdBlockNumber;}
      return (a === b ? 0 : a > b ? 1 : -1);
    });
    return data;
}
