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
