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
