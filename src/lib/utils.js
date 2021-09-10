const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
}
module.exports.getEpochFromDateString = (dateString) => {
    const date = new Date(dateString);
    const dateNoTime = new Date(date.getFullYear(),date.getMonth(),date.getDate());
    return dateNoTime.getTime()/1000.0; 
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
