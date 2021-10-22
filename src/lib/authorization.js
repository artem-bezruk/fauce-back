const buildAllowAllPolicy = (event, principalId) => {
    const policy = {
        principalId: principalId,
        policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn
            }]
        }
    }
    return policy;
}
module.exports.handler = async (event, context, callback) => {
    var authorizationHeader = event.headers.Authorization;  
    if (!authorizationHeader) context.fail('Unauthorized');
    var encodedCreds = authorizationHeader.split(' ')[1];
    console.log(JSON.stringify(encodedCreds));
    var plainCreds = (new Buffer(encodedCreds, 'base64')).toString().split(':');
    console.log(JSON.stringify(plainCreds));
    var username = plainCreds[0];
    var password = plainCreds[1];
    console.log(`username = ${username}, password=${password}`);
    if (!((username === process.env.HTTP_BASIC_AUTH_USER) && (password === process.env.HTTP_BASIC_AUTH_PASSWORD))) 
        context.fail('Unauthorized');
    const authResponse = buildAllowAllPolicy(event, username)
    return authResponse;
}
